# Getting Started with DeFi SaveTogether

Welcome to **DeFi SaveTogether** - a blockchain-based microfinance platform for group savings and loans. This guide will help you get started whether you're developing, deploying, or demoing the platform.

## Table of Contents

- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Development Setup (30 minutes)](#development-setup-30-minutes)
- [Running the Application](#running-the-application)
- [Demo Guide](#demo-guide)
- [What's Included](#whats-included)

---

## Quick Start (5 minutes)

### Prerequisites

- **Node.js** v18 or higher (v20 recommended)
- **npm** or **pnpm** package manager
- **Foundry** - Install via: `curl -L https://foundry.paradigm.xyz | bash && foundryup`

### Get Up and Running

```bash
# Clone the repository
git clone <repository-url>
cd DeFi-SaveTogether

# Install Foundry dependencies
forge install

# Install frontend dependencies
cd app
npm install

# Start the development server
npm run dev
```

Visit **http://localhost:3000** to see the application!

---

## Development Setup (30 minutes)

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
~/.foundry/bin/foundryup
```

### 2. Install Dependencies

**Smart Contract Dependencies:**
```bash
# From project root
forge install OpenZeppelin/openzeppelin-contracts foundry-rs/forge-std --no-git
```

**Frontend Dependencies:**
```bash
cd app
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it:

```bash
# Copy example file
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Network Configuration
DIDLAB_RPC_URL=https://eth.didlab.org
PRIVATE_KEY_DEPLOYER=<your_private_key>
OWNER_ADDRESS=<your_wallet_address>

# LabUSDT Token (DIDLab Testnet)
LABUSDT_ADDRESS=0x196352460396EE701e419439837FDFf5C451A4c6

# Deployed Contract Addresses (filled after deployment)
ATTESTATION_REGISTRY=
TREASURY=
GOVERNANCE_LITE=
GROUP_VAULT=
SAVINGS_POOL=
CREDIT_LINE=
```

**Frontend Environment (.env.local):**

```bash
# Create app/.env.local
cd app
cp .env.example .env.local
```

Configure with your deployed contract addresses:

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

### 4. Build and Test Smart Contracts

```bash
# Build contracts
forge build

# Run tests
forge test -vvv
```

### 5. Run the Frontend

```bash
cd app
npm run dev
```

The application will be available at **http://localhost:3000**

---

## Running the Application

### Development Mode

```bash
cd app
npm run dev
```

Starts the Next.js development server with hot reload at **http://localhost:3000**

### Production Build

```bash
cd app
npm run build
npm start
```

Creates an optimized production build in the `.next/` directory.

### Running Tests

```bash
# Smart contract tests
forge test -vvv

# Frontend tests (if configured)
cd app
npm test
```

---

## Demo Guide

### Quick Demo Setup (30 minutes)

This guide helps you prepare a working demo for presentations or hackathons.

#### Prerequisites for Demo

1. **MetaMask Wallet** with DIDLab network configured:
   - Chain ID: `252501`
   - RPC URL: `https://eth.didlab.org`
   - Currency: TT (TRUST)
   - Explorer: `https://explorer.didlab.org`

2. **Test Tokens:**
   - TT tokens for gas (get from https://faucet.didlab.org)
   - LabUSDT tokens (testnet stablecoin)

3. **Test Accounts:** 2-3 wallet addresses for demonstrating group functionality

#### Demo Flow (5 minutes)

**Step 1: Introduction (30 seconds)**
- Explain the problem: 1.7 billion unbanked adults globally
- Solution: Group-based microfinance on blockchain

**Step 2: Savings Demo (1 minute)**
```bash
# Connect wallet at /savings page
# Show LabUSDT balance
# Approve LabUSDT spending
# Deposit 50-100 LabUSDT
# Show updated balance and streak
```

**Step 3: Groups Demo (1 minute)**
```bash
# Navigate to /groups page
# Show existing test group
# Explain 3-of-5 approval mechanism
# Demonstrate group trust model
```

**Step 4: Loans Demo (1.5 minutes)**
```bash
# Navigate to /loans page
# Request a loan (e.g., 100 LabUSDT for 8 weeks)
# Show interest calculation (2%)
# Explain group approval process
# Show loan disbursement
```

**Step 5: Admin/Governance (1 minute)**
```bash
# Show governance parameters
# Demonstrate pause mechanism
# Explain DAO governance model
```

**Step 6: Closing (1 minute)**
- Highlight impact: Financial inclusion for unbanked
- Tech stack: Solidity, Next.js, DIDLab
- Open source and transparent

#### Demo Troubleshooting

**Transaction Failing:**
- Check you have TT tokens for gas
- Verify LabUSDT approval
- Ensure wallet is connected to DIDLab network

**Can't Read Contract Data:**
- Verify contract addresses in `.env.local`
- Check RPC URL is correct
- Try refreshing the page

**Wallet Not Connecting:**
- Add DIDLab network to MetaMask manually
- Clear browser cache
- Try different browser

---

## What's Included

### Smart Contracts (`/contracts`)

- **SavingsPool.sol** - Weekly savings with streak tracking
- **GroupVault.sol** - Group formation and loan approvals
- **CreditLine.sol** - Loan origination and repayment
- **Treasury.sol** - Platform fee collection
- **GovernanceLite.sol** - Parameter management and pause control
- **AttestationRegistry.sol** - KYC/identity verification

### Frontend Application (`/app`)

Modern Next.js application with:
- **Wagmi/Viem** for Web3 integration
- **Brutalist black & white design system**
- **Responsive mobile-first UI**
- **Real-time contract interaction**

**Key Pages:**
- `/` - Dashboard with live stats
- `/savings` - Deposit and track savings
- `/groups` - Create and manage groups
- `/loans` - Request and repay loans
- `/admin` - Governance controls

### Documentation (`/docs`)

- **architecture.md** - System design overview
- **params.md** - Governance parameters
- **threat-model.md** - Security analysis
- **project-docs/** - Comprehensive technical documentation

### Development Scripts (`/script`)

- `00_deploy_all.s.sol` - Deploy all contracts
- `01_seed_params.s.sol` - Initialize governance parameters
- Various helper scripts for testing and deployment

---

## Key Features

### For Users
- **Weekly Savings** - Build credit through consistent saving
- **Group Loans** - Peer-approved microloans
- **Low Interest** - 2% standard rate
- **No Traditional Credit Score** - Community-based trust
- **Achievement Badges** - NFT rewards for milestones
- **Governance Tokens** - Earn SAVE tokens through participation

### For Developers
- **Clean Architecture** - Modular, extensible contracts
- **Comprehensive Tests** - Property-based and unit tests
- **Modern Stack** - Latest Solidity, Next.js, TypeScript
- **Well Documented** - Clear inline comments and guides
- **Open Source** - MIT licensed

---

## Common Commands Reference

```bash
# Smart Contracts
forge build                  # Compile contracts
forge test -vvv             # Run tests with verbose output
forge script <script>       # Run deployment script

# Frontend
npm run dev                 # Start development server
npm run build              # Create production build
npm run lint               # Run linter

# Development
git add . && git commit    # Commit changes
git push                   # Push to remote

# Deployment
forge script script/00_deploy_all.s.sol --rpc-url $DIDLAB_RPC_URL --broadcast
```

---

## Next Steps

1. **For Developers:** Review the [Smart Contracts Documentation](docs/project-docs/02_smart_contracts.md)
2. **For Deployment:** See the [Deployment Guide](DEPLOYMENT_GUIDE.md)
3. **For Architecture:** Read the [Architecture Overview](docs/architecture.md)
4. **For Security:** Check the [Threat Model](docs/threat-model.md)

---

## Need Help?

- **Documentation:** Check the `/docs` folder
- **Issues:** Open an issue on GitHub
- **DIDLab Support:** Join the DIDLab Discord
- **Contract Explorer:** https://explorer.didlab.org

---

## Project Structure

```
DeFi-SaveTogether/
├── contracts/          # Solidity smart contracts
├── script/            # Deployment and utility scripts
├── test/              # Smart contract tests
├── app/               # Next.js frontend application
├── docs/              # Documentation
├── subgraph/          # GraphQL subgraph (optional)
└── foundry.toml       # Foundry configuration
```

---

**Ready to build something amazing?** Follow the setup steps above and start developing! 🚀
