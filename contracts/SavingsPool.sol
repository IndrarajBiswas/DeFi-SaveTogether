// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Maths} from "./libs/Maths.sol";

/// @notice Users deposit weekly savings in LabUSDT; track consecutive weeks
contract SavingsPool is ReentrancyGuard {
  using SafeERC20 for IERC20;

  event Deposited(address indexed user, uint256 amount, uint40 weekIdx);
  event Withdrawn(address indexed user, uint256 amount);

  IERC20 public immutable asset;

  mapping(address => uint256) public balanceOf;
  mapping(address => uint40) public lastWeek;
  mapping(address => uint16) public streak; // consecutive weeks

  constructor(IERC20 _asset) { asset = _asset; }

  function _currentWeek() internal view returns (uint40) {
    return Maths.weekIndex(block.timestamp);
  }

  function deposit(uint256 amount) external nonReentrant {
    require(amount > 0, "AMOUNT");
    asset.safeTransferFrom(msg.sender, address(this), amount);
    balanceOf[msg.sender] += amount;

    uint40 w = _currentWeek();
    uint40 lw = lastWeek[msg.sender];
    if (lw == 0 || w == lw) {
      // same week or first deposit, streak unchanged
    } else if (w == lw + 1) {
      streak[msg.sender] += 1;
    } else {
      streak[msg.sender] = 1; // reset streak; count this week
    }
    if (lw == 0) streak[msg.sender] = 1; // first week counts as 1
    lastWeek[msg.sender] = w;
    emit Deposited(msg.sender, amount, w);
  }

  function withdraw(uint256 amount) external nonReentrant {
    require(amount > 0 && amount <= balanceOf[msg.sender], "BALANCE");
    balanceOf[msg.sender] -= amount;
    asset.safeTransfer(msg.sender, amount);
    emit Withdrawn(msg.sender, amount);
  }

  function consecutiveWeeks(address user) external view returns (uint16) {
    uint40 w = _currentWeek();
    uint40 lw = lastWeek[user];
    if (lw == 0) return 0;
    // if current week passed without deposit, streak would reset off-chain; 
    // on-chain keeps last recorded streak; UI handles projection.
    if (w > lw + 1 && streak[user] > 0) {
      return 1; // minimum fallback when gap detected
    }
    return streak[user];
  }
}
