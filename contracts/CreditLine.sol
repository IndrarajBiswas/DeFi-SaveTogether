// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IAttestationRegistry { function isEligible(address user, uint8 minLevel) external view returns (bool); }
interface ISavingsPool { function consecutiveWeeks(address user) external view returns (uint16); }
interface IGroupVault {
  function getGroup(uint256 gid) external view returns (address[] memory members, uint256 stake, uint8 minApprovals, bool active);
  function approvalCount(uint256 gid, uint256 loanId) external view returns (uint256);
  function hasApproved(uint256 gid, uint256 loanId, address member) external view returns (bool);
  function slashOnDefault(uint256 gid, uint256 amount) external;
}
interface IGovernanceLite {
  function minAttestationLevel() external view returns (uint8);
  function rateBpsPer4Weeks() external view returns (uint16);
  function platformFeeBps() external view returns (uint16);
  function minPrincipal() external view returns (uint256);
  function maxPrincipal() external view returns (uint256);
  function groupMaxExposure() external view returns (uint256);
}

/// @notice Opens loans, tracks repayment and defaults
contract CreditLine is AccessControl, Pausable, ReentrancyGuard {
  using SafeERC20 for IERC20;

  bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
  bytes32 public constant BORROWER_ROLE = keccak256("BORROWER_ROLE");

  struct Loan {
    address borrower;
    uint256 principal;
    uint256 rateBps;
    uint40  start;
    uint40  termWeeks;
    uint256 repaid;
    uint256 groupId;
    bool    defaulted;
  }

  event LoanOpened(
    uint256 indexed loanId,
    address borrower,
    uint256 principal,
    uint256 rateBps,
    uint40 termWeeks,
    uint256 gid
  );
  event Repaid(uint256 indexed loanId, address payer, uint256 amount, uint256 newRepaid);
  event Rescheduled(uint256 indexed loanId, uint40 extraWeeks, uint256 fee);
  event Defaulted(uint256 indexed loanId, uint256 outstanding, uint256 gid);

  IERC20 public immutable asset;
  IAttestationRegistry public immutable attest;
  ISavingsPool public immutable savings;
  IGroupVault public immutable groups;
  IGovernanceLite public immutable gov;
  address public treasury;

  Loan[] public loans;
  mapping(address => bool) public hasActiveLoan; // MVP one active per borrower
  mapping(uint256 => uint256) public groupExposure; // gid => outstanding principal

  constructor(
    IERC20 _asset,
    IAttestationRegistry _attest,
    ISavingsPool _savings,
    IGroupVault _groups,
    IGovernanceLite _gov,
    address admin,
    address _treasury
  ) {
    asset = _asset;
    attest = _attest;
    savings = _savings;
    groups = _groups;
    gov = _gov;
    treasury = _treasury;
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
  }

  function loanCount() external view returns (uint256) { return loans.length; }

  function openLoan(
    uint256 gid,
    address borrower,
    uint256 principal,
    uint256 rateBps,
    uint40 termWeeks
  ) external whenNotPaused nonReentrant returns (uint256 loanId) {
    require(attest.isEligible(borrower, gov.minAttestationLevel()), "KYC");
    require(!hasActiveLoan[borrower], "ACTIVE");
    require(principal >= gov.minPrincipal() && principal <= gov.maxPrincipal(), "RANGE");
    require(rateBps == gov.rateBpsPer4Weeks(), "RATE");
    require(termWeeks == 4 || termWeeks == 8 || termWeeks == 12, "TERM");

    (, , uint8 minApprovals, bool active) = groups.getGroup(gid);
    require(active, "GROUP");
    // Require some off-chain coordinated loanId approvals. We check at least minApprovals approved
    // for a pseudo loanId derived from borrower address (simple MVP guard against no-approval opens).
    uint256 pseudoId = uint256(uint160(borrower));
    require(groups.approvalCount(gid, pseudoId) >= uint256(minApprovals), "APPROVALS");

    // group exposure guard
    uint256 newExposure = groupExposure[gid] + principal;
    require(newExposure <= gov.groupMaxExposure(), "EXPOSURE");

    loanId = loans.length;
    loans.push(Loan({
      borrower: borrower,
      principal: principal,
      rateBps: rateBps,
      start: uint40(block.timestamp),
      termWeeks: termWeeks,
      repaid: 0,
      groupId: gid,
      defaulted: false
    }));
    hasActiveLoan[borrower] = true;
    groupExposure[gid] = newExposure;

    // disburse principal to borrower (pull LabUSDT from this contract's balance — funded via admin for MVP)
    asset.safeTransfer(borrower, principal);
    emit LoanOpened(loanId, borrower, principal, rateBps, termWeeks, gid);
  }

  function repay(uint256 loanId, uint256 amount) external nonReentrant whenNotPaused {
    Loan storage L = loans[loanId];
    require(!L.defaulted, "DEFAULT");
    require(amount > 0, "AMOUNT");
    asset.safeTransferFrom(msg.sender, address(this), amount);
    L.repaid += amount;
    emit Repaid(loanId, msg.sender, amount, L.repaid);

    if (L.repaid >= totalDue(loanId)) {
      hasActiveLoan[L.borrower] = false;
      groupExposure[L.groupId] -= L.principal;
      // collect platform fee to treasury: principal * feeBps / 10000
      uint256 fee = (L.principal * gov.platformFeeBps()) / 10000;
      if (fee > 0 && treasury != address(0)) {
        asset.safeTransfer(treasury, fee);
      }
    }
  }

  function reschedule(uint256 loanId, uint40 extraWeeks) external whenNotPaused {
    Loan storage L = loans[loanId];
    require(msg.sender == L.borrower, "SENDER");
    require(!L.defaulted, "DEFAULT");
    require(extraWeeks > 0 && extraWeeks <= 12, "WEEKS");
    L.termWeeks += extraWeeks;
    uint256 fee = (L.principal * 50) / 10000; // 0.5% reschedule fee (placeholder)
    emit Rescheduled(loanId, extraWeeks, fee);
  }

  function markDefault(uint256 loanId) external whenNotPaused {
    Loan storage L = loans[loanId];
    require(!L.defaulted, "DEFAULT");
    // if now > start + termWeeks*WEEK + 7 days and repaid < totalDue
    uint256 endTs = uint256(L.start) + uint256(L.termWeeks) * 7 days + 7 days;
    require(block.timestamp > endTs, "GRACE");
    uint256 due = totalDue(loanId);
    require(L.repaid < due, "PAID");

    L.defaulted = true;
    hasActiveLoan[L.borrower] = false;
    uint256 outstanding = due - L.repaid;
    // slash 5% of outstanding, bounded by stake (actual transfer managed in GroupVault)
    uint256 slashAmount = (outstanding * 500) / 10000;
    groups.slashOnDefault(L.groupId, slashAmount);
    emit Defaulted(loanId, outstanding, L.groupId);
  }

  function dueAt(uint256 loanId, uint40 weekIdx) external view returns (uint256) {
    Loan storage L = loans[loanId];
    uint256 total = totalDue(loanId);
    if (L.termWeeks == 0) return 0;
    uint256 perWeek = total / L.termWeeks;
    return perWeek * weekIdx; // caller uses successive weekIdx=1..termWeeks for schedule
  }

  function totalDue(uint256 loanId) public view returns (uint256) {
    Loan storage L = loans[loanId];
    uint256 blocks4w = uint256(L.termWeeks) / 4;
    uint256 interest = (L.principal * L.rateBps * blocks4w) / 10000;
    return L.principal + interest;
  }
}
