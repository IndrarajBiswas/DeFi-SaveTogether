// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract GovernanceLite is Ownable, Pausable {
  constructor(address owner_) Ownable(owner_) {}
  event ParamUpdated(bytes32 key, uint256 oldVal, uint256 newVal);

  // parameters
  uint8 public minAttestationLevel = 1;
  uint16 public rateBpsPer4Weeks = 200; // 2%
  uint16 public platformFeeBps = 50; // 0.5%
  uint256 public minPrincipal = 25e6; // LabUSDT (6 decimals)
  uint256 public maxPrincipal = 250e6;
  uint40[] public terms = [4, 8, 12];
  uint40 public graceDays = 7;
  uint16 public groupStakeBps = 500; // 5%
  uint256 public groupMaxExposure = 2000e6;

  function setRateBps(uint256 newBps) external onlyOwner {
    emit ParamUpdated("rateBpsPer4Weeks", rateBpsPer4Weeks, newBps);
    rateBpsPer4Weeks = uint16(newBps);
  }
  function setMaxExposure(uint256 newCap) external onlyOwner {
    emit ParamUpdated("groupMaxExposure", groupMaxExposure, newCap);
    groupMaxExposure = newCap;
  }
  function setMinPrincipal(uint256 v) external onlyOwner {
    emit ParamUpdated("minPrincipal", minPrincipal, v);
    minPrincipal = v;
  }
  function setMaxPrincipal(uint256 v) external onlyOwner {
    emit ParamUpdated("maxPrincipal", maxPrincipal, v);
    maxPrincipal = v;
  }
  function pause() external onlyOwner { _pause(); }
  function unpause() external onlyOwner { _unpause(); }
}
