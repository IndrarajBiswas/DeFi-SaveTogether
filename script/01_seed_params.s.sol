// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {AttestationRegistry} from "../contracts/AttestationRegistry.sol";

contract SeedParams is Script {
  function run() external {
    address issuer = vm.envAddress("OWNER_ADDRESS");
    address registry = vm.envAddress("ATTESTATION_REGISTRY");

    vm.startBroadcast();
    AttestationRegistry(registry).setIssuer(issuer, true);
    vm.stopBroadcast();
  }
}

