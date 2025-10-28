// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Maths {
  uint40 internal constant WEEK = 7 days;

  function min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }

  function weekIndex(uint256 ts) internal pure returns (uint40) {
    return uint40(ts / WEEK);
  }
}

