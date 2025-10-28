// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title Treasury
/// @notice Receives platform fees; withdrawable by owner (governance)
contract Treasury is Ownable {
  constructor(address owner_) Ownable(owner_) {}
  event FeeCollected(uint256 amount);

  address public creditLine;

  modifier onlyCreditLine() {
    require(msg.sender == creditLine, "NOT_CREDITLINE");
    _;
  }

  function setCreditLine(address _cl) external onlyOwner {
    creditLine = _cl;
  }

  receive() external payable {}

  function collectFee(uint256 amount) external onlyCreditLine {
    emit FeeCollected(amount);
  }

  function sweep(address payable to) external onlyOwner {
    to.transfer(address(this).balance);
  }
}
