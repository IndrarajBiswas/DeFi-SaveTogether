// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {GovernanceLite} from "../contracts/GovernanceLite.sol";

contract GovernanceTest is Test {
  function testUpdateParams() public {
    GovernanceLite g = new GovernanceLite(address(this));
    g.setMaxExposure(10_000e6);
    assertEq(g.groupMaxExposure(), 10_000e6);
    g.pause(); g.unpause();
  }
}
