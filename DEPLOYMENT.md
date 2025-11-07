# DeFi SaveTogether - Deployment Guide

This guide provides step-by-step instructions for deploying all contracts to the DIDLab testnet and setting up the complete system.

## Prerequisites

1. **Foundry** - Install from [getfoundry.sh](https://getfoundry.sh)
2. **Node.js** - v18 or higher
3. **Private Key** - Deployment wallet with testnet ETH
4. **LabUSDT** - Testnet address: `0x196352460396EE701e419439837FDFf5C451A4c6`

## Phase 1-2: Core System (CRITICAL)

### Step 1: Setup Environment

Create `.env` file in project root:

```bash
# Network Configuration
DIDLAB_RPC_URL=https://eth.didlab.org
PRIVATE_KEY_DEPLOYER=<your_private_key>
OWNER_ADDRESS=<your_wallet_address>

# LabUSDT Token
LABUSDT_ADDRESS=0x196352460396EE701e419439837FDFf5C451A4c6

# Addresses (will be filled after deployment)
ATTESTATION_REGISTRY=
TREASURY=
GOVERNANCE_LITE=
GROUP_VAULT=
SAVINGS_POOL=
CREDIT_LINE=
ACHIEVEMENT_BADGES=
SAVE_TOKEN=
GOVERNANCE_VOTING=

# Badge Minter (optional - for monitoring script)
BADGE_MINTER_PRIVATE_KEY=
```

### Step 2: Compile Contracts

```bash
forge build
```

Expected output: All contracts compile without errors.

### Step 3: Deploy Core Contracts

```bash
forge script script/00_deploy_all.s.sol:DeployAll \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast \
  --verify
```

**IMPORTANT:** Save the deployed addresses! Update them in `.env`:

```bash
ATTESTATION_REGISTRY=<deployed_address>
TREASURY=<deployed_address>
GOVERNANCE_LITE=<deployed_address>
GROUP_VAULT=<deployed_address>
SAVINGS_POOL=<deployed_address>
CREDIT_LINE=<deployed_address>
```

### Step 4: Seed Initial Parameters

```bash
forge script script/01_seed_params.s.sol:SeedParams \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast
```

This sets:
- Group max exposure: 2000 LabUSDT
- Min principal: 25 LabUSDT
- Max principal: 250 LabUSDT
- Rate: 200 bps (2%)
- Platform fee: 50 bps (0.5%)
- Min attestation level: 1

### Step 5: Fund CreditLine Treasury

The CreditLine contract needs LabUSDT to disburse loans:

```bash
# Get some testnet LabUSDT (ask in DIDLab Discord or use faucet)
# Then transfer to CreditLine contract

cast send $LABUSDT_ADDRESS \
  "transfer(address,uint256)" \
  $CREDIT_LINE \
  10000000000 \  # 10,000 LabUSDT (6 decimals)
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Step 6: Set Up Test Users

```bash
# Attest test users (give them KYC level 1)
cast send $ATTESTATION_REGISTRY \
  "attest(address,uint8)" \
  <test_user_address> \
  1 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Step 7: Update Frontend Environment

Update `app/.env.local`:

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

## Phase 3: Bonus Features

### Step 1: Deploy Bonus Contracts

```bash
forge script script/02_deploy_bonus_features.s.sol:DeployBonusFeatures \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast \
  --verify
```

Save addresses to `.env`:

```bash
ACHIEVEMENT_BADGES=<deployed_address>
SAVE_TOKEN=<deployed_address>
GOVERNANCE_VOTING=<deployed_address>
```

### Step 2: Configure Badge Minter

```bash
# Authorize an address to mint badges
cast send $ACHIEVEMENT_BADGES \
  "setAuthorizedMinter(address,bool)" \
  <minter_address> \
  true \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### Step 3: Start Badge Monitor (Optional)

```bash
npm install
npx ts-node script/badge-monitor.ts
```

Keep this running in the background to automatically award badges.

### Step 4: Update Frontend for Bonus Features

Add to `app/.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ACHIEVEMENT_BADGES=<address>
NEXT_PUBLIC_CONTRACT_SAVE_TOKEN=<address>
NEXT_PUBLIC_CONTRACT_GOVERNANCE_VOTING=<address>
```

## Phase 4: Subgraph (Optional)

### Step 1: Install Graph CLI

```bash
npm install -g @graphprotocol/graph-cli
```

### Step 2: Update Subgraph Configuration

Edit `subgraph/subgraph.yaml` with deployed addresses:

```yaml
dataSources:
  - kind: ethereum/contract
    name: CreditLine
    network: didlab
    source:
      address: "<CREDIT_LINE_ADDRESS>"
      abi: CreditLine
      startBlock: <deployment_block>
```

### Step 3: Deploy Subgraph

```bash
cd subgraph
graph auth --product hosted-service <access_token>
graph deploy --product hosted-service <username>/savetogether
```

## Testing the System

### 1. Test Savings Flow

```bash
# Approve SavingsPool to spend LabUSDT
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

### 2. Test Group Creation

```bash
cast send $GROUP_VAULT \
  "createGroup(address[],uint8)" \
  "[0xAddress1,0xAddress2,0xAddress3,0xAddress4,0xAddress5]" \
  3 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

### 3. Test Loan Flow

```bash
# 1. Group members approve loan (pseudo ID = borrower address as uint256)
cast send $GROUP_VAULT \
  "approveLoan(uint256,uint256)" \
  0 \  # group ID
  <borrower_address_as_uint256> \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $MEMBER1_KEY

# 2. Open loan
cast send $CREDIT_LINE \
  "openLoan(uint256,address,uint256,uint256,uint40)" \
  0 \  # group ID
  $BORROWER_ADDRESS \
  100000000 \  # 100 LabUSDT principal
  200 \  # 2% rate
  8 \  # 8 weeks
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER

# 3. Repay loan
cast send $CREDIT_LINE \
  "repay(uint256,uint256)" \
  0 \  # loan ID
  50000000 \  # 50 LabUSDT
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

## Verification Checklist

After deployment, verify:

- [ ] All contracts deployed successfully
- [ ] Contract addresses saved to `.env`
- [ ] CreditLine funded with LabUSDT
- [ ] Test users attested (KYC level 1)
- [ ] Frontend environment variables updated
- [ ] Test deposit works
- [ ] Test group creation works
- [ ] Test loan workflow works
- [ ] Badge monitor running (optional)
- [ ] Subgraph deployed (optional)

## Contract Interactions

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

### Admin Functions

```bash
# Update governance parameter
cast send $GOVERNANCE_LITE \
  "setParam(string,uint256)" \
  "maxPrincipal" \
  500000000 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER

# Pause CreditLine
cast send $GOVERNANCE_LITE \
  "pause()" \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER

# Award badge manually
cast send $ACHIEVEMENT_BADGES \
  "awardBadge(address,uint256)" \
  $USER_ADDRESS \
  1 \
  --rpc-url $DIDLAB_RPC_URL \
  --private-key $PRIVATE_KEY_DEPLOYER
```

## Troubleshooting

### Issue: Transactions failing with "KYC" error
**Solution:** Attest the user with `attest(address,uint8)` on AttestationRegistry

### Issue: Loan opens failing with "APPROVALS" error
**Solution:** Ensure enough group members called `approveLoan` with the borrower's address as uint256

### Issue: "Insufficient funds" when opening loan
**Solution:** Fund the CreditLine contract with LabUSDT

### Issue: Frontend not connecting
**Solution:**
1. Check `.env.local` has correct contract addresses
2. Ensure MetaMask is on DIDLab network (Chain ID: 252501)
3. Clear browser cache and restart Next.js dev server

### Issue: Badge monitor not awarding badges
**Solution:**
1. Check `BADGE_MINTER_PRIVATE_KEY` is set
2. Ensure the minter address is authorized: `authorizedMinters[address] == true`
3. Check RPC connection to DIDLab

## Network Information

**DIDLab Trust Testnet**
- Chain ID: 252501
- RPC: https://eth.didlab.org
- Explorer: https://explorer.didlab.org
- Currency: ETH (testnet)

## Support

For issues or questions:
1. Check contract events on [DIDLab Explorer](https://explorer.didlab.org)
2. Review transaction logs for revert reasons
3. Join DIDLab Discord for testnet support
4. Open issue on GitHub repository

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to git
- Use separate wallets for testnet and mainnet
- Verify all contract addresses before large transfers
- Test with small amounts first
- Keep private keys secure
- Use hardware wallets for production deployments

## Next Steps

After successful deployment:
1. Test all user flows end-to-end
2. Monitor badge awards and token distributions
3. Gather user feedback
4. Plan for mainnet deployment
5. Conduct security audit before mainnet launch
