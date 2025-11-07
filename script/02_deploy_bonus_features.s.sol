// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {AchievementBadges} from "../src/AchievementBadges.sol";
import {SaveToken} from "../src/SaveToken.sol";
import {GovernanceVoting} from "../src/GovernanceVoting.sol";

/// @notice Deploy bonus feature contracts (Phase 3)
contract DeployBonusFeatures is Script {
  function run() external {
    address admin = vm.envAddress("OWNER_ADDRESS");

    vm.startBroadcast();

    // Deploy AchievementBadges
    AchievementBadges badges = new AchievementBadges();
    console.log("AchievementBadges deployed at:", address(badges));

    // Deploy SaveToken
    SaveToken saveToken = new SaveToken();
    console.log("SaveToken deployed at:", address(saveToken));

    // Deploy GovernanceVoting
    GovernanceVoting governance = new GovernanceVoting(address(saveToken));
    console.log("GovernanceVoting deployed at:", address(governance));

    // Setup: Authorize admin as badge minter
    badges.setAuthorizedMinter(admin, true);
    console.log("Admin authorized as badge minter");

    // Setup: Authorize admin as reward distributor
    saveToken.setRewardDistributor(admin, true);
    console.log("Admin authorized as reward distributor");

    vm.stopBroadcast();

    console.log("\n=== Deployment Summary ===");
    console.log("AchievementBadges:", address(badges));
    console.log("SaveToken:", address(saveToken));
    console.log("GovernanceVoting:", address(governance));
    console.log("\nAdd these addresses to your .env file:");
    console.log("ACHIEVEMENT_BADGES=%s", address(badges));
    console.log("SAVE_TOKEN=%s", address(saveToken));
    console.log("GOVERNANCE_VOTING=%s", address(governance));
  }
}
