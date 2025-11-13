# Deployment Guide - DeFi SaveTogether

This comprehensive guide provides step-by-step instructions for deploying the DeFi SaveTogether platform to the DIDLab testnet, configuring the system, and managing operations.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Phase 1: Core System Deployment](#phase-1-core-system-deployment)
- [Phase 2: Configuration & Testing](#phase-2-configuration--testing)
- [Phase 3: Bonus Features (Optional)](#phase-3-bonus-features-optional)
- [Phase 4: Subgraph (Optional)](#phase-4-subgraph-optional)
- [Operational Procedures](#operational-procedures)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)

---

## Prerequisites

Before deploying, ensure you have:

1. **Foundry** - Install from [getfoundry.sh](https://getfoundry.sh)
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Node.js** - Version 18 or higher

3. **Deployment Wallet** with:
   - TRUST (TT) tokens for gas - Get from https://faucet.didlab.org
   - Access to LabUSDT tokens for liquidity

4. **Environment Setup** - Configured `.env` file (see below)

5. **Network Access** - DIDLab RPC endpoint: `https://eth.didlab.org`

---

## Pre-Deployment Checklist

Verify these items before starting deployment:

- [ ] Foundry and npm dependencies installed
- [ ] Deployer wallet funded with TT tokens for gas
- [ ] LabUSDT tokens available for CreditLine liquidity
- [ ] `.env` file properly configured
- [ ] Contracts compile successfully (`forge build`)
- [ ] Tests pass (`forge test`)
- [ ] Parameter values reviewed and approved

---

## Phase 1: Core System Deployment

### Step 1: Configure Environment

Create a `.env` file in the project root:

```bash
# Network Configuration
DIDLAB_RPC_URL=https://eth.didlab.org
PRIVATE_KEY_DEPLOYER=<your_private_key>
OWNER_ADDRESS=<your_wallet_address>

# LabUSDT Token (DIDLab Testnet)
LABUSDT_ADDRESS=0x196352460396EE701e419439837FDFf5C451A4c6

# Deployed Addresses (will be filled after deployment)
ATTESTATION_REGISTRY=
TREASURY=
GOVERNANCE_LITE=
GROUP_VAULT=
SAVINGS_POOL=
CREDIT_LINE=
ACHIEVEMENT_BADGES=
SAVE_TOKEN=
GOVERNANCE_VOTING=

# Optional - Badge Minter (for monitoring script)
BADGE_MINTER_PRIVATE_KEY=
```

### Step 2: Compile Contracts

```bash
forge build
```

**Expected Output:** All contracts compile without errors.

### Step 3: Deploy Core Contracts

Deploy all core system contracts with a single command:

```bash
forge script script/00_deploy_all.s.sol:DeployAll \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast \
  --legacy \
  --with-gas-price 2gwei \
  --verify
```

**Flags Explained:**
- `--rpc-url`: Network RPC endpoint
- `--broadcast`: Execute transactions on-chain
- `--legacy`: Use legacy transaction format (required for DIDLab)
- `--with-gas-price`: Set gas price to 2 gwei
- `--verify`: Verify contracts on block explorer (optional)

**Important:** After successful deployment, the contract addresses will be output to the console and saved to `script/addresses.json`.

### Step 4: Save Deployed Addresses

Update your `.env` file with the deployed addresses:

```bash
ATTESTATION_REGISTRY=<deployed_address>
TREASURY=<deployed_address>
GOVERNANCE_LITE=<deployed_address>
GROUP_VAULT=<deployed_address>
SAVINGS_POOL=<deployed_address>
CREDIT_LINE=<deployed_address>
```

### Step 5: Seed Governance Parameters

Initialize the system with default parameters:

```bash
forge script script/01_seed_params.s.sol:SeedParams \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast \
  --legacy \
  --with-gas-price 2gwei
```

**Default Parameters Set:**
- Group max exposure: 2000 LabUSDT
- Min principal: 25 LabUSDT
- Max principal: 250 LabUSDT
- Interest rate: 200 bps (2%)
- Platform fee: 50 bps (0.5%)
- Min attestation level: 1

Review and modify these in `script/01_seed_params.s.sol` before deployment if needed.

### Step 6: Fund CreditLine Treasury

The CreditLine contract needs LabUSDT liquidity to disburse loans:

```bash
cast send $LABUSDT_ADDRESS \
  "transfer(address,uint256)" \
  $CREDIT_LINE \
  10000000000 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

**Note:** This transfers 10,000 LabUSDT (6 decimals). Adjust amount as needed.

---

## Phase 2: Configuration & Testing

### Step 1: Attest Test Users

Give test users KYC attestation (required to use the platform):

```bash
cast send $ATTESTATION_REGISTRY \
  "attest(address,uint8)" \
  <test_user_address> \
  1 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

Repeat for multiple test users. Attestation level `1` is the minimum required.

### Step 2: Update Frontend Configuration

Update `app/.env.local` with deployed addresses:

```bash
NEXT_PUBLIC_DIDLAB_RPC_URL=https://eth.didlab.org
NEXT_PUBLIC_CONTRACT_ATTESTATION_REGISTRY=<address>
NEXT_PUBLIC_CONTRACT_TREASURY=<address>
NEXT_PUBLIC_CONTRACT_GOVERNANCE=<address>
NEXT_PUBLIC_CONTRACT_GROUP_VAULT=<address>
NEXT_PUBLIC_CONTRACT_SAVINGS_POOL=<address>
NEXT_PUBLIC_CONTRACT_CREDIT_LINE=<address>
NEXT_PUBLIC_STABLE_TOKEN=0x196352460396EE701e419439837FDFf5C451A4c6
```

### Step 3: Smoke Tests

Run these tests to verify the deployment:

**Test 1: Savings Flow**
```bash
# Approve SavingsPool
cast send $LABUSDT_ADDRESS \
  "approve(address,uint256)" \
  $SAVINGS_POOL \
  100000000 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER

# Deposit to savings
cast send $SAVINGS_POOL \
  "deposit(uint256)" \
  100000000 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER

# Check balance
cast call $SAVINGS_POOL \
  "balanceOf(address)" \
  $OWNER_ADDRESS \
  --rpc-url $DIDLAB_RPC_URL
```

**Test 2: Group Creation**
```bash
cast send $GROUP_VAULT \
  "createGroup(address[],uint8)" \
  "[0xAddr1,0xAddr2,0xAddr3,0xAddr4,0xAddr5]" \
  3 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

**Test 3: Loan Flow**
```bash
# Group members approve loan
cast send $GROUP_VAULT \
  "approveLoan(uint256,uint256)" \
  0 \
  <borrower_address_as_uint256> \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $MEMBER_KEY

# Open loan
cast send $CREDIT_LINE \
  "openLoan(uint256,address,uint256,uint256,uint40)" \
  0 \
  $BORROWER_ADDRESS \
  100000000 \
  200 \
  8 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER

# Repay loan
cast send $CREDIT_LINE \
  "repay(uint256,uint256)" \
  0 \
  50000000 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Step 4: Verify on Explorer

Visit https://explorer.didlab.org and verify:
- All contract deployments succeeded
- Configuration transactions confirmed
- Test transactions executed properly
- Contract addresses are correct

**Capture at least one state-changing transaction for documentation/reporting.**

---

## Phase 3: Bonus Features (Optional)

### Step 1: Deploy Bonus Contracts

```bash
forge script script/02_deploy_bonus_features.s.sol:DeployBonusFeatures \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast \
  --legacy \
  --with-gas-price 2gwei \
  --verify
```

Save addresses to `.env`:
```bash
ACHIEVEMENT_BADGES=<deployed_address>
SAVE_TOKEN=<deployed_address>
GOVERNANCE_VOTING=<deployed_address>
```

### Step 2: Configure Badge Minter

Authorize an address to mint achievement badges:

```bash
cast send $ACHIEVEMENT_BADGES \
  "setAuthorizedMinter(address,bool)" \
  <minter_address> \
  true \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Step 3: Start Badge Monitor (Optional)

Run the automated badge monitoring script:

```bash
npm install
npx ts-node script/badge-monitor.ts
```

Keep this running in the background to automatically award achievement badges.

### Step 4: Update Frontend for Bonus Features

Add to `app/.env.local`:
```bash
NEXT_PUBLIC_CONTRACT_ACHIEVEMENT_BADGES=<address>
NEXT_PUBLIC_CONTRACT_SAVE_TOKEN=<address>
NEXT_PUBLIC_CONTRACT_GOVERNANCE_VOTING=<address>
```

---

## Phase 4: Subgraph (Optional)

### Step 1: Install Graph CLI

```bash
npm install -g @graphprotocol/graph-cli
```

### Step 2: Update Subgraph Configuration

Edit `subgraph/subgraph.yaml` with your deployed addresses:

```yaml
dataSources:
  - kind: ethereum/contract
    name: CreditLine
    network: didlab
    source:
      address: "<CREDIT_LINE_ADDRESS>"
      abi: CreditLine
      startBlock: <deployment_block_number>
  - kind: ethereum/contract
    name: SavingsPool
    network: didlab
    source:
      address: "<SAVINGS_POOL_ADDRESS>"
      abi: SavingsPool
      startBlock: <deployment_block_number>
```

### Step 3: Deploy Subgraph

```bash
cd subgraph
graph auth --product hosted-service <access_token>
graph deploy --product hosted-service <username>/savetogether
```

---

## Operational Procedures

### Pausing the Protocol (Emergency)

```bash
cast send $GOVERNANCE_LITE \
  "pause()" \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Unpausing the Protocol

```bash
cast send $GOVERNANCE_LITE \
  "unpause()" \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Updating Governance Parameters

```bash
cast send $GOVERNANCE_LITE \
  "setParam(string,uint256)" \
  "maxPrincipal" \
  500000000 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Withdrawing Treasury Fees

```bash
cast send $TREASURY \
  "withdraw(address,uint256)" \
  $RECIPIENT_ADDRESS \
  <amount> \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Awarding Badges Manually

```bash
cast send $ACHIEVEMENT_BADGES \
  "awardBadge(address,uint256)" \
  $USER_ADDRESS \
  1 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### View Functions

```bash
# Get user's savings balance
cast call $SAVINGS_POOL "balanceOf(address)" $USER_ADDRESS --rpc-url $DIDLAB_RPC_URL

# Get user's streak
cast call $SAVINGS_POOL "streak(address)" $USER_ADDRESS --rpc-url $DIDLAB_RPC_URL

# Get user's attestation level
cast call $ATTESTATION_REGISTRY "levelOf(address)" $USER_ADDRESS --rpc-url $DIDLAB_RPC_URL

# Get loan details
cast call $CREDIT_LINE "loans(uint256)" 0 --rpc-url $DIDLAB_RPC_URL

# Get user's active loan ID
cast call $CREDIT_LINE "borrowerLoanId(address)" $USER_ADDRESS --rpc-url $DIDLAB_RPC_URL

# Get group details
cast call $GROUP_VAULT "getGroup(uint256)" 0 --rpc-url $DIDLAB_RPC_URL

# Get user's badges
cast call $ACHIEVEMENT_BADGES "getUserBadges(address)" $USER_ADDRESS --rpc-url $DIDLAB_RPC_URL
```

### Monitoring & Maintenance

- **Track Key Events** via subgraph dashboards:
  - `Defaulted`
  - `GroupSlashed`
  - `ParamUpdated`
  - `LoanOpened`
  - `LoanRepaid`

- **Review Savings Distributions** weekly

- **Rotate Issuer Allowlist** when onboarding/offboarding partners:
  ```bash
  cast send $ATTESTATION_REGISTRY "setIssuer(address,bool)" <issuer> true --rpc-url $DIDLAB_RPC_URL
  ```

---

## Troubleshooting

### Issue: Transactions Failing with "KYC" Error

**Solution:** User needs attestation. Attest them using:
```bash
cast send $ATTESTATION_REGISTRY "attest(address,uint8)" <user> 1 --rpc-url $DIDLAB_RPC_URL
```

### Issue: Loan Opens Failing with "APPROVALS" Error

**Solution:** Ensure enough group members called `approveLoan` with the borrower's address as uint256.
Minimum approvals = group's `minApprovals` threshold.

### Issue: "Insufficient Funds" When Opening Loan

**Solution:** Fund the CreditLine contract with LabUSDT:
```bash
cast send $LABUSDT_ADDRESS "transfer(address,uint256)" $CREDIT_LINE <amount> --rpc-url $DIDLAB_RPC_URL
```

### Issue: Frontend Not Connecting

**Solutions:**
1. Check `app/.env.local` has correct contract addresses
2. Ensure MetaMask is on DIDLab network (Chain ID: 252501)
3. Clear browser cache
4. Restart Next.js dev server (`npm run dev`)

### Issue: Badge Monitor Not Awarding Badges

**Solutions:**
1. Check `BADGE_MINTER_PRIVATE_KEY` is set in `.env`
2. Verify minter address is authorized: `authorizedMinters[address] == true`
3. Check RPC connection to DIDLab
4. Review monitor logs for errors

### Issue: Contract Verification Failed

**Solution:** Manually verify on explorer:
1. Go to https://explorer.didlab.org
2. Find your contract address
3. Click "Verify & Publish"
4. Upload flattened source code

---

## Security Notes

### Critical Security Practices

- **Never commit `.env` to git** - Add to `.gitignore`
- **Use separate wallets** for testnet and mainnet
- **Verify all contract addresses** before large transfers
- **Test with small amounts first** before production use
- **Keep private keys secure** - Use hardware wallets for production
- **Enable 2FA** on all critical accounts
- **Regular backups** of contract addresses and configurations

### Pre-Mainnet Requirements

Before deploying to mainnet:

1. **Security Audit** - Complete third-party smart contract audit
2. **Bug Bounty** - Launch bug bounty program
3. **Insurance** - Consider protocol insurance
4. **Multisig** - Use multisig wallet for admin functions
5. **Timelocks** - Implement timelocks for governance actions
6. **Monitoring** - Set up comprehensive monitoring and alerting
7. **Incident Response Plan** - Document emergency procedures

---

## Rollback Procedure

In case of critical issues, follow this rollback process:

### Step 1: Pause the Platform

```bash
cast send $GOVERNANCE_LITE "pause()" --rpc-url $DIDLAB_RPC_URL --private-key $PRIVATE_KEY_DEPLOYER
```

### Step 2: Assess the Situation

- Identify the issue
- Determine if rollback is necessary
- Estimate impact on users

### Step 3: Deploy New Contracts (if needed)

```bash
forge script script/00_deploy_all.s.sol --rpc-url $DIDLAB_RPC_URL --broadcast
```

### Step 4: Migrate State (Complex)

This requires custom scripts and significant manual effort. Consider:
- User balances
- Active loans
- Group memberships
- Attestation levels

### Step 5: Update Frontend and Subgraph

Point to new contract addresses.

### Step 6: Unpause New Platform

```bash
cast send $NEW_GOVERNANCE_LITE "unpause()" --rpc-url $DIDLAB_RPC_URL
```

---

## Deployment Verification Checklist

After deployment, verify:

- [ ] All core contracts deployed successfully
- [ ] Contract addresses saved to `.env` and `addresses.json`
- [ ] CreditLine funded with adequate LabUSDT
- [ ] Test users attested (KYC level 1)
- [ ] Frontend environment variables updated
- [ ] Governance parameters seeded correctly
- [ ] Test deposit transaction works
- [ ] Test group creation works
- [ ] Test loan workflow end-to-end
- [ ] All transactions visible on explorer
- [ ] Badge monitor running (if using bonus features)
- [ ] Subgraph deployed and indexing (if applicable)
- [ ] Documentation updated with addresses
- [ ] Team notified of deployment completion

---

## Network Information

### DIDLab Trust Testnet

- **Chain ID:** 252501
- **RPC URL:** https://eth.didlab.org
- **Explorer:** https://explorer.didlab.org
- **Currency:** TT (TRUST tokens)
- **Faucet:** https://faucet.didlab.org

### LabUSDT Token

- **Address:** `0x196352460396EE701e419439837FDFf5C451A4c6`
- **Decimals:** 6
- **Type:** Testnet Stablecoin

---

## Support Resources

For issues or questions:

1. **Explorer:** Check transaction logs at https://explorer.didlab.org
2. **GitHub:** Open issues at the project repository
3. **DIDLab Discord:** Join for testnet support
4. **Documentation:** Review `/docs` folder for technical details

---

## Next Steps After Deployment

1. **Test Thoroughly:** Run through all user flows end-to-end
2. **Monitor Activity:** Set up dashboards for key metrics
3. **Gather Feedback:** Deploy to staging environment for user testing
4. **Document Addresses:** Update all documentation with contract addresses
5. **Plan Mainnet:** Prepare security audit and mainnet deployment checklist

---

**Deployment Complete?** Congratulations! 🎉

Review the [Architecture Documentation](docs/architecture.md) and [Governance Model](docs/project-docs/06_governance_and_security.md) to understand the system you've deployed.
