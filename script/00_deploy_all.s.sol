// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {AttestationRegistry} from "../contracts/AttestationRegistry.sol";
import {GroupVault} from "../contracts/GroupVault.sol";
import {SavingsPool} from "../contracts/SavingsPool.sol";
import {CreditLine, IAttestationRegistry, ISavingsPool, IGroupVault, IGovernanceLite} from "../contracts/CreditLine.sol";
import {Treasury} from "../contracts/Treasury.sol";
import {GovernanceLite} from "../contracts/GovernanceLite.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployAll is Script {
  function run() external {
    address admin = vm.envAddress("OWNER_ADDRESS");
    address labUsdt = vm.envAddress("LABUSDT_ADDRESS");

    vm.startBroadcast();
    AttestationRegistry reg = new AttestationRegistry(admin);

    Treasury treasury = new Treasury(admin);

    GovernanceLite gov = new GovernanceLite(admin);

    GroupVault gv = new GroupVault(IERC20(labUsdt), admin);
    SavingsPool sp = new SavingsPool(IERC20(labUsdt));
    CreditLine cl = new CreditLine(
      IERC20(labUsdt),
      IAttestationRegistry(address(reg)),
      ISavingsPool(address(sp)),
      IGroupVault(address(gv)),
      IGovernanceLite(address(gov)),
      admin,
      address(treasury)
    );

    // wire roles
    gv.grantRole(gv.CREDITLINE_ROLE(), address(cl));
    treasury.setCreditLine(address(cl));

    vm.stopBroadcast();
  }
}
