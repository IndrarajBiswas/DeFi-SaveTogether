// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GroupVault} from "../contracts/GroupVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockUSDC2 is IERC20 {
  string public constant name = "MockUSDC"; string public constant symbol = "mUSDC"; uint8 public constant decimals = 6;
  mapping(address=>uint256) public override balanceOf; mapping(address=>mapping(address=>uint256)) public override allowance; uint256 public override totalSupply;
  function transfer(address to,uint256 v) external override returns(bool){balanceOf[msg.sender]-=v;balanceOf[to]+=v;return true;}
  function approve(address s,uint256 v) external override returns(bool){allowance[msg.sender][s]=v;return true;}
  function transferFrom(address f,address t,uint256 v) external override returns(bool){uint256 a=allowance[f][msg.sender];require(a>=v);allowance[f][msg.sender]=a-v;balanceOf[f]-=v;balanceOf[t]+=v;return true;}
  function mint(address to,uint256 v) external {balanceOf[to]+=v;totalSupply+=v;}
}

contract GroupsTest is Test {
  MockUSDC2 usdc; GroupVault gv; address admin = address(this);
  function setUp() public { usdc = new MockUSDC2(); gv = new GroupVault(IERC20(address(usdc)), admin); }
  function testCreateAndApprove() public {
    address[] memory m = new address[](3); m[0]=address(1); m[1]=address(2); m[2]=address(3);
    uint256 gid = gv.createGroup(m, 2);
    vm.prank(m[1]); gv.approveLoan(gid, 123);
    vm.prank(m[2]); gv.approveLoan(gid, 123);
  }
}

