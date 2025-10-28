// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title AttestationRegistry
/// @notice Minimal registry for off-chain KYC attestations with whitelisted issuers
contract AttestationRegistry is Ownable {
  constructor(address owner_) Ownable(owner_) {}
  event Attested(address indexed user, uint8 level, address indexed issuer);

  mapping(address => bool) public isIssuer; // whitelisted VC issuers
  mapping(address => uint8) public levelOf; // user => level

  modifier onlyIssuer() {
    require(isIssuer[msg.sender], "NOT_ISSUER");
    _;
  }

  function setIssuer(address issuer, bool allowed) external onlyOwner {
    isIssuer[issuer] = allowed;
  }

  function attest(address user, uint8 level) external onlyIssuer {
    require(user != address(0), "ZERO");
    levelOf[user] = level;
    emit Attested(user, level, msg.sender);
  }

  function isEligible(address user, uint8 minLevel) external view returns (bool) {
    return levelOf[user] >= minLevel;
  }
}
