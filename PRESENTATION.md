---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.svg')
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  h1 {
    color: #2563eb;
  }
  h2 {
    color: #1e40af;
  }
  .columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
---

# DeFi SaveTogether

**Blockchain-Powered Microfinance for the Unbanked**

> Grameen-style group lending meets decentralized finance

**Target:** 1.7 billion unbanked adults globally
**Advantage:** 2% interest vs 20-40% traditional | <5% overhead vs 95%
**Status:** MVP deployed on DIDLab Trust Network

📍 **Live Demo:** whoami.didlab.org (Cloudflare Tunnel)

---

# Blockchain Architecture

<div class="columns">
<div>

### DIDLab Network
- **Chain ID:** 252501
- **Platform:** EVM-compatible
- **Tech:** Solidity 0.8.24
- **Framework:** Foundry
- **Security:** OpenZeppelin

### Smart Contracts (456 lines)
- **SavingsPool** - Weekly deposits & streaks
- **GroupVault** - Group formation & approvals
- **CreditLine** - Loan lifecycle management
- **Treasury** - Fee collection (0.5%)
- **GovernanceLite** - Parameter controls
- **AttestationRegistry** - KYC/identity

</div>
<div>

### Lending Flow

```
1. Weekly Savings
   ↓
2. Group Formation (5-8 members)
   ↓
3. Loan Request
   ↓
4. Group Vote (3-of-5 approval)
   ↓
5. Loan Disbursement (2% interest)
   ↓
6. Repayment (8-12 weeks)
   ↓
7. Default? → Group Stake Slashed
```

**Deployed:** LabUSDT (stablecoin)
**Gas:** TRUST (TT) tokens

</div>
</div>

---

# Frontend & User Experience

<div class="columns">
<div>

### Tech Stack
- **Framework:** Next.js 14 + React 18
- **Language:** TypeScript
- **Web3:** wagmi 2.12.17 + viem 2.9.7
- **State:** React Query (@tanstack)
- **Styling:** TailwindCSS
- **Validation:** Zod 3.23.8

### Key Features
✅ Real-time wallet integration
✅ Transaction status tracking
✅ Mobile-responsive design
✅ Achievement/badge system
✅ Analytics dashboards

</div>
<div>

### Application Pages

| Page | Purpose |
|------|---------|
| **Dashboard** | Balance, streak, attestation |
| **Savings** | Deposits, streak tracking |
| **Groups** | Create/join, view members |
| **Loans** | Request, approve, repay |
| **Governance** | Vote on parameters |
| **Analytics** | Protocol metrics |
| **Admin** | System controls |
| **Badges** | Achievement system |

**Components:** WalletControls, TransactionModal, LoanApprovalCard, AccountSetupGuide

</div>
</div>

---

# Automation & Testing Infrastructure

<div class="columns">
<div>

### Deployment Scripts
**Foundry Solidity Scripts:**
- `00_deploy_all.s.sol` - Deploy 6 core contracts
- `01_seed_params.s.sol` - Initialize governance
- `02_deploy_bonus_features.s.sol` - Optional features
- `addresses.json` - Contract address registry

### Testing Suite
**4 comprehensive test files (~3,500+ lines):**
- `Credit.t.sol` - Loan lifecycle
- `Governance.t.sol` - Parameter management
- `Groups.t.sol` - Formation & approvals
- `Savings.t.sol` - Deposits & streaks

**Commands:** `forge test -vvv`, `forge test --gas-report`

</div>
<div>

### Monitoring & Operations
- **badge-monitor.ts** - Achievement tracking
- **Auto-rebuild** - Git pull triggers automatic rebuild
- **Configuration** - `foundry.toml`, `.env`, contract addresses

### Environment Setup
```bash
# Smart Contracts
forge build
forge test

# Frontend
cd app && npm install
npm run dev
```

**Deployment:** Legacy transactions (2 gwei)
**Verification:** DIDLab block explorer

</div>
</div>

---

# Repository & CI/CD Pipeline

<div class="columns">
<div>

### GitHub Actions Workflow
**File:** `.github/workflows/ci.yml`

**Triggers:**
- Every `push` to any branch
- Every `pull_request`

**Pipeline Stages:**
1. ✅ Checkout code & submodules
2. ✅ Install Foundry (nightly)
3. ✅ Build smart contracts (`forge build`)
4. ✅ Run test suite (`forge test -vvv`)
5. ✅ Build frontend (`npm install && npm run build`)

**Status:** All checks passing ✅

</div>
<div>

### Deployment & Hosting

**Hosting:** Cloudflare Tunnel
**URL:** whoami.didlab.org
**Auto-Deploy:** Git pull → Automatic rebuild

**Repository Structure:**
```
├── contracts/     # 6 Solidity files
├── script/        # Deployment scripts
├── test/          # 4 test suites
├── app/           # Next.js frontend
├── docs/          # Architecture docs
├── subgraph/      # The Graph indexing
└── .github/       # CI/CD workflows
```

**Key Addresses (DIDLab):**
- LabUSDT: `0x1963524...51A4c6`
- SavingsPool: `0x585EE16...8344cE`
- CreditLine: `0xD7A9Ed1...Fb9eDAa`

</div>
</div>

---

### Thank You

**🌐 Live Demo:** whoami.didlab.org
**📦 Repository:** github.com/IndrarajBiswas/DeFi-SaveTogether
**🔗 Network:** DIDLab Trust (Chain 252501)

*Empowering financial inclusion through blockchain technology*
