# Deployment Runbook

This document provides a step-by-step guide for deploying and managing the DIDLab Microfinance application on a live network. It is intended for developers and administrators responsible for the platform's operations.

## Pre-Deployment Checklist

Before you begin the deployment process, ensure you have completed the following:

1.  **Environment Variables**: Your `.env` file is fully configured with the correct values for the target network (DIDLab). This includes:
    *   `DIDLAB_RPC_URL`
    *   `PRIVATE_KEY_DEPLOYER` (this account will have administrative privileges)
    *   `LABUSDT_ADDRESS`
    *   `OWNER_ADDRESS`

2.  **Gas**: The deployer account is funded with sufficient TRUST (TT) to cover the gas costs of the deployment.

3.  **Foundry**: You have the latest version of Foundry installed and have run `forge install` to get the correct dependencies.

## Deployment Procedure

The deployment process is automated using Foundry scripts. It is divided into two main steps:

### Step 1: Deploy the Contracts

This script deploys all the smart contracts and sets up the initial access control roles.

```bash
forge script script/00_deploy_all.s.sol --rpc-url $DIDLAB_RPC_URL --broadcast --legacy --with-gas-price 2gwei --verify
```

*   `--rpc-url`: Specifies the RPC endpoint for the target network.
*   `--broadcast`: Broadcasts the transactions to the network.
*   `--verify`: (Optional but recommended) Verifies the contract source code on Etherscan.

Upon successful execution, this script will save the addresses of the deployed contracts to `script/addresses.json`.

### Step 2: Seed the Governance Parameters

This script initializes the `GovernanceLite` contract with the initial set of parameters.

```bash
forge script script/01_seed_params.s.sol --rpc-url $DIDLAB_RPC_URL --broadcast --legacy --with-gas-price 2gwei
```

It is crucial to review the parameters in `script/01_seed_params.s.sol` before running this script to ensure they are appropriate for the target network.

## Post-Deployment Configuration

After the smart contracts are deployed and configured, you need to update the frontend and the subgraph with the new contract addresses.

### Frontend

1.  Copy the contract addresses from `script/addresses.json`.
2.  Paste the addresses into the appropriate configuration file in the `app/lib/` directory.
3.  Rebuild and redeploy the frontend application.

### Subgraph

1.  Update the contract addresses in `subgraph.yaml`.
2.  Rebuild and redeploy the subgraph.

## Operational Guidance

### Pausing and Unpausing

The `GovernanceLite` contract has a `pause()` and `unpause()` function that can be used to temporarily halt all activity on the platform. This is a critical safety feature that can be used in case of an emergency.

Only the owner of the `GovernanceLite` contract can call these functions.

### Updating Governance Parameters

The owner of the `GovernanceLite` contract can update the platform's parameters at any time. It is recommended to have a clear and transparent process for making such changes, including notifying the community in advance.

### Withdrawing Fees

The owner of the `Treasury` contract can withdraw the platform fees that have been collected. This should be done on a regular basis.

## Rollback Procedure

In the event of a critical bug or a security vulnerability, it may be necessary to roll back the platform to a previous version. This is a complex and disruptive process that should only be undertaken as a last resort.

The general steps for a rollback are:

1.  **Pause the platform**: This will prevent any further activity.
2.  **Deploy a new set of contracts**: This will create a fresh instance of the platform.
3.  **Migrate the data**: This is the most challenging step. It involves migrating the state from the old contracts to the new ones. This may require custom scripts and a significant amount of manual effort.
4.  **Update the frontend and subgraph**: Point the frontend and subgraph to the new contract addresses.
5.  **Unpause the new platform**.

Given the complexity of a rollback, it is essential to have a robust testing and auditing process in place to minimize the risk of critical bugs.

---

Next, read the **[Governance and Security](./06_governance_and_security.md)** documentation to understand the platform's governance model and security considerations.
