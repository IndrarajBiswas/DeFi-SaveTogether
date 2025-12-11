# DeFi SaveTogether

> **Blockchain-powered microfinance for group savings and loans**

A full-stack DeFi platform implementing Grameen-style group lending on the DIDLab Trust network. SaveTogether enables transparent, community-based microfinance through smart contracts, bringing financial inclusion to the unbanked.

[![DIDLab Network](https://img.shields.io/badge/DIDLab-Chain%20252501-blue)](https://explorer.didlab.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

**DeFi SaveTogether** combines blockchain technology with proven microfinance principles to create a transparent, low-cost alternative to traditional banking for underserved communities.

### Key Features

- **Weekly Savings** - Build credit through consistent deposit streaks
- **Group Lending** - Community-based loan approvals (3-of-5 consensus)
- **Joint Liability** - Shared accountability with slashable stake
- **Low Interest Rates** - 2% standard rate vs. traditional 20-40%
- **No Credit Scores** - Social collateral replaces traditional credit checks
- **Transparent On-Chain** - All transactions verifiable on blockchain
- **DAO Governance** - Community-driven parameter management

### Mission

Unlock transparent, savings-first credit for small groups through shared incentives, verifiable attestations, and low-cost on-chain infrastructure.

## Quick Links

- **[Getting Started](GETTING_STARTED.md)** - Setup and installation guide
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy to DIDLab testnet
- **[Architecture](docs/architecture.md)** - System design overview
- **[Documentation](docs/project-docs/)** - Comprehensive technical docs
- **[Milestone Updates](docs/updates/)** - Week-by-week submissions (W6–W14)
- **[RUNBOOK](RUNBOOK.md)** and **[CHANGELOG](CHANGELOG.md)** - Freeze & polish artifacts
- **[Security Notes](SECURITY_NOTES.md)** and **[Threat Model](docs/security/THREAT_MODEL.md)**

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Interface                       │
│              (Next.js + wagmi + TailwindCSS)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contracts Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SavingsPool  │  │  GroupVault  │  │  CreditLine  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Treasury    │  │  Governance  │  │ Attestation  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DIDLab Trust Network                    │
│              (Chain ID: 252501 | RPC: eth.didlab.org)      │
└─────────────────────────────────────────────────────────────┘
```

See [Architecture Documentation](docs/architecture.md) for detailed component interactions and data flows.

## Milestone Timeline (W6–W14)

| Week | Focus | Evidence |
|------|-------|----------|
| [W6 — Environment & Skeleton](docs/updates/W6_UPDATE.md) | Tooling ready, CI green, board seeded | README quickstart + CI workflow + backlog link |
| [W7 — Vertical Slice](docs/updates/W7_UPDATE.md) | CLI deposit → contract → event readback | [Mermaid diagram](docs/diagrams/W7_VERTICAL_SLICE.md) + 2 tests |
| [W8 — Feature 1](docs/updates/W8_UPDATE.md) | Savings streaks observable + negative test | Dashboard event feed + deposit revert coverage |
| [W9 — Feature 2 + AuthZ](docs/updates/W9_UPDATE.md) | Group approvals with role enforcement | [SECURITY_NOTES](SECURITY_NOTES.md) + unauthorized failure test |
| [W10 — Security Sprint](docs/updates/W10_UPDATE.md) | Threat model + 3 mitigations implemented | [THREAT_MODEL](docs/security/THREAT_MODEL.md) + guard tests |
| [W11 — Testing & Metrics](docs/updates/W11_UPDATE.md) | ≥10 tests + latency metric | [W11_METRICS](docs/metrics/W11_METRICS.md) + harness commands |
| [W12 — LLM/Analytics](docs/updates/W12_UPDATE.md) | Analytics dashboard + LLM finding fix | Screenshot in metrics doc; test added |
| [W13 — Freeze & Polish](docs/updates/W13_UPDATE.md) | MVP frozen; runbook verified | [CHANGELOG](CHANGELOG.md) + [RUNBOOK](RUNBOOK.md) confirmation |
| [W14 — Dry Run](docs/updates/W14_UPDATE.md) | Poster/pitch rehearsal | [DEMO_SCRIPT](docs/demo/DEMO_SCRIPT.md) + [poster](docs/demo/poster.md) |

Project board: https://github.com/orgs/IndrarajBiswas/projects/1 (Backlog/MVP/Polish lanes).

## Repository Structure

```
DeFi-SaveTogether/
├── contracts/              # Solidity smart contracts
│   ├── SavingsPool.sol    # Weekly savings & streak tracking
│   ├── GroupVault.sol     # Group formation & loan approvals
│   ├── CreditLine.sol     # Loan origination & repayment
│   ├── Treasury.sol       # Platform fee collection
│   ├── GovernanceLite.sol # Parameter management
│   └── AttestationRegistry.sol  # KYC/identity verification
│
├── script/                # Deployment & utility scripts
│   ├── 00_deploy_all.s.sol
│   ├── 01_seed_params.s.sol
│   └── addresses.json     # Deployed contract addresses
│
├── test/                  # Smart contract tests
│   └── *.t.sol           # Foundry test suite
│
├── app/                   # Next.js frontend application
│   ├── pages/            # Application pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities & contract integrations
│   └── styles/           # CSS & design system
│
├── docs/                  # Documentation
│   ├── architecture.md   # System design
│   ├── params.md         # Governance parameters
│   ├── threat-model.md   # Security analysis
│   ├── project-docs/     # Detailed technical docs
│   ├── hackathon/        # Sprint planning & strategies
│   └── presentation/     # Demo materials & slides
│
├── subgraph/             # The Graph indexing (optional)
│   ├── schema.graphql
│   └── subgraph.yaml
│
├── GETTING_STARTED.md    # Quick start guide
├── DEPLOYMENT_GUIDE.md   # Deployment instructions
└── README.md             # This file
```

## Technology Stack

### Blockchain & Smart Contracts
- **Solidity** ^0.8.19 - Smart contract language
- **Foundry** - Development framework
- **OpenZeppelin** - Secure contract libraries
- **DIDLab Network** - EVM-compatible testnet

### Frontend
- **Next.js** 14 - React framework
- **TypeScript** - Type-safe development
- **wagmi** - Web3 React hooks
- **viem** - Ethereum interactions
- **TailwindCSS** - Styling framework

### Indexing & APIs (Optional)
- **The Graph** - Blockchain indexing
- **GraphQL** - Query language

## Getting Started

### Prerequisites

- Node.js v18+ (v20 recommended)
- Foundry toolchain
- MetaMask or compatible Web3 wallet

### Quick Setup

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone repository
git clone https://github.com/IndrarajBiswas/DeFi-SaveTogether.git
cd DeFi-SaveTogether

# Install dependencies
forge install
cd app && npm install

# Configure environment
cp .env.example .env
cp app/.env.example app/.env.local

# Build contracts
forge build

# Run tests
forge test -vvv

# Start development server
cd app && npm run dev
```

Visit **http://localhost:3000** to see the application.

For detailed setup instructions, see [Getting Started Guide](GETTING_STARTED.md).

## Smart Contract Overview

### Core Contracts

| Contract | Purpose | Key Functions |
|----------|---------|---------------|
| **SavingsPool** | Weekly savings with streak tracking | `deposit()`, `withdraw()`, `streak()` |
| **GroupVault** | Group formation & loan approvals | `createGroup()`, `approveLoan()` |
| **CreditLine** | Loan origination & repayment | `openLoan()`, `repay()`, `liquidate()` |
| **Treasury** | Platform fee collection | `withdraw()`, `balance()` |
| **GovernanceLite** | Parameter management | `setParam()`, `pause()`, `unpause()` |
| **AttestationRegistry** | KYC/identity verification | `attest()`, `levelOf()` |

### How It Works

1. **Savings Phase** - Users deposit LabUSDT weekly to build savings streaks
2. **Group Formation** - 5-8 members create a group with collective stake
3. **Loan Approval** - Group votes 3-of-5 to approve member loan requests
4. **Loan Disbursement** - Approved loans disbursed with 2% interest
5. **Repayment** - Borrower repays over 8-12 weeks
6. **Default Handling** - Group stake slashed if member defaults

## Deployed Contracts (DIDLab Testnet)

| Contract | Address |
|----------|---------|
| LabUSDT | `0x196352460396EE701e419439837FDFf5C451A4c6` |
| SavingsPool | `0x585EE16799bEE3cE0A221B2D4aC12313158344cE` |
| GroupVault | `0xa0F8BFa8aa5E0a6Cbe7EB8c6BCF56E0e75Bfb39B` |
| CreditLine | `0xD7A9Ed10c7A50C8eD3A6cC450A7cDcDE7Fb9eDAa` |

See [Deployment Guide](DEPLOYMENT_GUIDE.md) for deployment instructions.

## Development

### Run Tests

```bash
# All tests
forge test -vvv

# Specific test file
forge test --match-path test/CreditLine.t.sol -vvv

# With gas reporting
forge test --gas-report
```

### Build Frontend

```bash
cd app
npm run dev          # Development mode
npm run build        # Production build
npm run lint         # Type checking & linting
```

### Deploy Contracts

```bash
# Configure .env first
forge script script/00_deploy_all.s.sol \
  --rpc-url $DIDLAB_RPC_URL \
  --broadcast \
  --legacy \
  --with-gas-price 2gwei
```

See [Deployment Guide](DEPLOYMENT_GUIDE.md) for complete instructions.

## Documentation

### Technical Documentation
- **[Getting Started](GETTING_STARTED.md)** - Setup and installation
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Deploy to testnet/mainnet
- **[Architecture](docs/architecture.md)** - System design overview
- **[Smart Contracts](docs/project-docs/02_smart_contracts.md)** - Contract specifications
- **[Frontend App](docs/project-docs/03_frontend_app.md)** - UI/UX documentation
- **[Subgraph](docs/project-docs/04_subgraph.md)** - GraphQL indexing
- **[Governance](docs/project-docs/06_governance_and_security.md)** - Security & parameters

### Operational Documentation
- **[Parameters](docs/params.md)** - Governance parameter reference
- **[Threat Model](docs/threat-model.md)** - Security analysis & mitigations

### Presentation Materials
- **[Demo Script](docs/presentation/DEMO_SCRIPT.md)** - Live demo guide
- **[Presentation Slides](docs/presentation/SLIDES.md)** - Pitch deck
- **[Executive Brief](docs/presentation/BRIEF.md)** - Project overview

## Use Cases

### For Users
- **Savers** - Earn interest on savings, build credit history
- **Borrowers** - Access low-interest loans without credit scores
- **Communities** - Form trust groups for mutual financial support

### For Organizations
- **NGOs** - Distribute aid transparently on-chain
- **Cooperatives** - Manage community savings pools
- **Microfinance Institutions** - Reduce operational costs 95%

### For Developers
- **Reference Implementation** - Learn DeFi microfinance patterns
- **Starter Template** - Fork and customize for specific markets
- **Integration** - Build on top of the protocol

## Impact & Market Opportunity

- **Target Market:** 1.7 billion unbanked adults globally
- **Cost Reduction:** 95% lower operational costs vs. traditional MFIs
- **Interest Rates:** 2% vs. 20-40% traditional microfinance
- **Transparency:** All transactions verifiable on-chain
- **Financial Inclusion:** No credit score or bank account required

## Security

- **Audited Contracts** - Based on OpenZeppelin standards
- **Property Testing** - Foundry invariant tests
- **Threat Modeling** - See [Threat Model](docs/threat-model.md)
- **Emergency Controls** - Pause mechanism for critical issues
- **Governance** - Multi-sig control for production deployments

**Note:** This is prototype software. Conduct thorough security audits before production use.

## Roadmap

### Phase 1: MVP (Current)
- [x] Core smart contracts
- [x] Basic frontend UI
- [x] DIDLab testnet deployment
- [x] Documentation

### Phase 2: Beta
- [ ] Security audit
- [ ] Achievement NFT badges
- [ ] Governance token (SAVE)
- [ ] Subgraph indexing
- [ ] Mobile-responsive UI

### Phase 3: Production
- [ ] Mainnet deployment
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Mobile app
- [ ] Community governance DAO

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Community

- **GitHub Issues** - Bug reports and feature requests
- **Discussions** - Community discussions and Q&A
- **DIDLab Discord** - Network support and community

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- **DIDLab Network** - Blockchain infrastructure
- **Grameen Bank** - Microfinance methodology inspiration
- **OpenZeppelin** - Secure smart contract libraries
- **Foundry** - Development framework

## Contact

- **Project Maintainer:** [IndrarajBiswas](https://github.com/IndrarajBiswas)
- **Repository:** https://github.com/IndrarajBiswas/DeFi-SaveTogether

---

**Built with ❤️ for financial inclusion**

*Empowering the unbanked through blockchain technology*
