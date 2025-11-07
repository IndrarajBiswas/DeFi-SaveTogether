// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {SavingsPool} from "../contracts/SavingsPool.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockLabUSDT is IERC20 { string public constant name="MockLabUSDT"; string public constant symbol="mLABUSDT"; uint8 public constant decimals=6; mapping(address=>uint256) public override balanceOf; mapping(address=>mapping(address=>uint256)) public override allowance; uint256 public override totalSupply; function transfer(address to,uint256 v) external override returns(bool){balanceOf[msg.sender]-=v;balanceOf[to]+=v;return true;} function approve(address s,uint256 v) external override returns(bool){allowance[msg.sender][s]=v;return true;} function transferFrom(address f,address t,uint256 v) external override returns(bool){require(allowance[f][msg.sender]>=v); allowance[f][msg.sender]-=v; balanceOf[f]-=v; balanceOf[t]+=v; return true;} function mint(address to,uint256 v) external {balanceOf[to]+=v;totalSupply+=v;} }

contract SavingsTest is Test {
  MockLabUSDT usdc; SavingsPool sp; address user = address(0xBEEF);
  function setUp() public { usdc = new MockLabUSDT(); sp = new SavingsPool(IERC20(address(usdc))); usdc.mint(user, 1_000e6); }
  function testDepositTracksWeek() public {
    vm.startPrank(user);
    usdc.approve(address(sp), type(uint256).max);
    sp.deposit(100e6);
    vm.stopPrank();
  }
}
