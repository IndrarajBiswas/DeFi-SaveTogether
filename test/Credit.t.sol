// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AttestationRegistry} from "../contracts/AttestationRegistry.sol";
import {GroupVault} from "../contracts/GroupVault.sol";
import {SavingsPool} from "../contracts/SavingsPool.sol";
import {CreditLine, IAttestationRegistry, ISavingsPool, IGroupVault, IGovernanceLite} from "../contracts/CreditLine.sol";

contract MockUSDC is IERC20 {
  string public constant name = "MockUSDC";
  string public constant symbol = "mUSDC";
  uint8 public constant decimals = 6;
  mapping(address => uint256) public override balanceOf;
  mapping(address => mapping(address => uint256)) public override allowance;
  uint256 public override totalSupply;
  function transfer(address to, uint256 v) external override returns (bool) { balanceOf[msg.sender] -= v; balanceOf[to] += v; return true; }
  function approve(address s, uint256 v) external override returns (bool) { allowance[msg.sender][s] = v; return true; }
  function transferFrom(address f, address t, uint256 v) external override returns (bool) { uint256 a = allowance[f][msg.sender]; require(a >= v, "allow"); allowance[f][msg.sender] = a - v; balanceOf[f] -= v; balanceOf[t] += v; return true; }
  function _mint(address to, uint256 v) external { balanceOf[to] += v; totalSupply += v; }
}

contract CreditTest is Test {
  MockUSDC usdc;
  AttestationRegistry reg;
  GroupVault gv;
  SavingsPool sp;
  CreditLine cl;

  address admin = address(0xA11CE);
  address borrower = address(0xB0);

  function setUp() public {
    usdc = new MockUSDC();
    reg = new AttestationRegistry(admin);
    vm.prank(admin);
    reg.setIssuer(admin, true);
    gv = new GroupVault(IERC20(address(usdc)), admin);
    sp = new SavingsPool(IERC20(address(usdc)));
    cl = new CreditLine(
      IERC20(address(usdc)),
      IAttestationRegistry(address(reg)),
      ISavingsPool(address(sp)),
      IGroupVault(address(gv)),
      new GovernanceStub(),
      admin,
      address(0)
    );
    vm.startPrank(admin);
    gv.grantRole(gv.CREDITLINE_ROLE(), address(cl));
    vm.stopPrank();

    usdc._mint(address(cl), 1_000_000e6);
    usdc._mint(borrower, 10_000e6);

    vm.prank(admin);
    reg.attest(borrower, 1);

    address[] memory m = new address[](3);
    m[0] = borrower; m[1] = address(0xC1); m[2] = address(0xC2);
    uint256 gid = gv.createGroup(m, 2);
    uint256 pseudoId = uint256(uint160(borrower));
    vm.prank(m[1]); gv.approveLoan(gid, pseudoId);
    vm.prank(m[2]); gv.approveLoan(gid, pseudoId);
  }

  function testOpenAndRepay() public {
    uint256 gid = 0;
    uint256 loanId = cl.openLoan(gid, borrower, 100e6, 200, 8);
    assertEq(loanId, 0);

    uint256 total = cl.totalDue(loanId);
    vm.prank(borrower);
    usdc.approve(address(cl), total);
    vm.prank(borrower);
    cl.repay(loanId, total);
  }
}

contract GovernanceStub is IGovernanceLite {
  function minAttestationLevel() external pure returns (uint8) { return 1; }
  function rateBpsPer4Weeks() external pure returns (uint16) { return 200; }
  function platformFeeBps() external pure returns (uint16) { return 50; }
  function minPrincipal() external pure returns (uint256) { return 25e6; }
  function maxPrincipal() external pure returns (uint256) { return 250e6; }
  function groupMaxExposure() external pure returns (uint256) { return 2000e6; }
}
