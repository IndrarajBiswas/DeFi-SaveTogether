# DIDLab Microfinance — End‑to‑End Project Brief (MVP)

This brief packages everything a non‑technical or technical audience needs to understand, evaluate, and demo the Grameen‑style, joint‑liability microfinance MVP on the DIDLab network. Use it as the single source for slides, demos, and hand‑offs.

---

## 1) Executive Summary

- Mission: Enable small groups (5–8) to access rotating credit with joint liability, savings discipline, and transparent on‑chain accounting.
- Network: DIDLab Trust testnet (Chain ID 252501).
- Asset: LabUSDT (6 decimals).
- Model: Savings‑first, one active loan per borrower, simple interest, weekly installments, group stake backstop.
- Privacy: No PII on‑chain; only hashes/CIDs for proofs; KYC via off‑chain VC issuers + on‑chain attestations.

---

## 2) Product Snapshot (Key Decisions)

- Group size: 5–8; approvals: 3‑of‑5 (majority)
- Savings rule: Min 4 consecutive weekly deposits before first loan (≥ 2 for later loans)
- Loan caps: 25–250 LabUSDT (MVP)
- Rate: 2.0% simple interest per 4‑week block
- Terms: 4, 8, or 12 weeks; Grace: 7 days
- Backstop: Group stake = 5% of max exposure (locked, slash on default)
- KYC: Off‑chain VC; on‑chain `AttestationRegistry` with `level ∈ {0,1,2}` (≥ 1 required)
- Fees: Platform fee 0.5% of principal to `Treasury`
- Governance: Emergency pause + parameter updates via `GovernanceLite` (owner = multisig)

---

## 3) Architecture Overview

- Contracts (Foundry): `AttestationRegistry`, `SavingsPool`, `GroupVault`, `CreditLine`, `Treasury`, `GovernanceLite`, `libs/Maths`.
- Subgraph (The Graph): Indexes Group/Loan/Savings events; provides read models for the app.
- App (Next.js + viem/wagmi): UX for onboarding, savings, group formation, approvals, loan desk, repayments, and admin.
- CI/CD: GitHub Actions (lint/build/test), scripted deploys to DIDLab.
- Reference: [`docs/architecture.md`](docs/architecture.md) contains component responsibilities and sequence diagrams.

---

## 4) Smart Contracts (MVP)

### AttestationRegistry
- Purpose: On‑chain record that a wallet has an off‑chain KYC attestation from a whitelisted issuer.
- Key event: `Attested(address user, uint8 level, address issuer)`
- Core functions: `setIssuer(issuer,bool)`, `attest(user,level)`, `isEligible(user,minLevel)`

### SavingsPool
- Purpose: Weekly LabUSDT deposits; track consecutive streaks.
- Events: `Deposited(user,amount,weekIdx)`, `Withdrawn(user,amount)`
- Core: `deposit(amount)`, `withdraw(amount)`, `consecutiveWeeks(user)`

### GroupVault
- Purpose: Group lifecycle, stake custody, loan approvals, and slashing hook.
- Struct: `Group { address[] members; uint256 stake; uint8 minApprovals; bool active; }`
- Events: `GroupCreated`, `GroupStakeLocked`, `GroupApproval`, `GroupSlashed`
- Core: `createGroup(members,minApprovals)`, `lockStake(gid,amount)`, `approveLoan(gid,loanId)`, `slashOnDefault(gid,amount)`

### CreditLine
- Purpose: Originate loans, track repayments/reschedules/defaults, enforce guard rails.
- Struct `Loan { borrower, principal, rateBps, start, termWeeks, repaid, groupId, defaulted }`
- Events: `LoanOpened`, `Repaid`, `Rescheduled`, `Defaulted`
- Core: `openLoan(gid, borrower, principal, rateBps, termWeeks)`, `repay(loanId, amount)`, `reschedule(loanId, extraWeeks)`, `dueAt(loanId, weekIdx)`, `totalDue(loanId)`

### Treasury
- Purpose: Sink for platform fees; governance‑owned.
- Event: `FeeCollected(amount)`
- Core: `setCreditLine(addr)`, `collectFee(amount)`, `sweep(to)`

### GovernanceLite
- Purpose: Pause and parameter management.
- Event: `ParamUpdated(key, oldVal, newVal)`
- Parameters: `minAttestationLevel`, `rateBpsPer4Weeks`, `platformFeeBps`, `minPrincipal`, `maxPrincipal`, `terms`, `graceDays`, `groupStakeBps`, `groupMaxExposure`
- Core: `pause()`, `unpause()`, setters for key params

### Security Controls
- OpenZeppelin: `Ownable`, `AccessControl`, `ReentrancyGuard`, `Pausable`, `SafeERC20`.
- CEI pattern; pull transfers; time math uses `uint40` weeks.
- Guard rails: KYC level, principal bounds, rate equality, term set, single active loan per borrower, group exposure cap, approval quorum.

---

## 5) Data & Indexing (Subgraph)

### Entities
- `Group { id, members, minApprovals, stake, active, loans[] }`
- `Loan { id, borrower, principal, rateBps, termWeeks, start, repaid, defaulted, group }`
- `LoanEvent { id, loan, kind, amount?, at }` — Opened | Repaid | Rescheduled | Defaulted
- `SavingsStat { id(user), consecutiveWeeks, lastWeek }`

### Handlers
- Group: `GroupCreated`, `GroupStakeLocked`
- Credit: `LoanOpened`, `Repaid`, `Rescheduled`, `Defaulted`
- Savings: `Deposited` → consecutive streak logic

---

## 6) Frontend (Next.js + viem)

- Pages: `/` (Overview), `/savings`, `/groups`, `/loans`, `/admin`.
- Chain config: Custom DIDLab chain definition in `app/lib/chains.ts`.
- Env: `NEXT_PUBLIC_DIDLAB_RPC_URL`, `NEXT_PUBLIC_SUBGRAPH_URL`.
- UX principles: Client‑side checks (KYC level, streak, exposure), allowance helpers, toasts, loading states.
- Current status: Static forms scaffolded; ready to wire to viem/wagmi actions and subgraph queries.

---

## 7) Governance & Parameters (Default)

- `minAttestationLevel = 1`
- `rateBpsPer4Weeks = 200`
- `platformFeeBps = 50`
- `minPrincipal = 25e6`, `maxPrincipal = 250e6`
- `terms = [4,8,12]`, `graceDays = 7`
- `groupStakeBps = 500` (5%)
- `groupMaxExposure = 2000e6`

See: `docs/params.md` for table and notes.

---

## 8) Acceptance Criteria (MVP)

- Contracts: 95%+ coverage; invariants pass; gas snapshots for core paths.
- Subgraph: Indexes all core events; sample PAR30 / on‑time queries.
- App: All flows usable on Sepolia; handles paused state, allowance, missing KYC.
- DevOps: CI green; scripted deploy to Sepolia; addresses recorded.

---

## 9) Manual QA Script (Testnet Demo)

1. Deploy to DIDLab; record addresses.
2. Fund demo wallets with test LabUSDT. Attest 5–6 users (level 1).
3. Form a group (5 members), set minApprovals=3; lock 5% stake.
4. Deposit weekly savings for 4 rounds (can warp in tests).
5. Request 100 LabUSDT / 8 weeks; gather 3 approvals; loan opens.
6. Repay 2 installments; reschedule once (+2 weeks); continue repayment.
7. Default a second loan to test `slashOnDefault` and exposure reduction.
8. Validate subgraph dashboards (PAR30, on‑time rate).
9. Test pause/unpause; confirm state‑changing calls revert while paused.

---

## 10) Threat Model (Abridged)

- Token handling: SafeERC20 + pull model; check return values.
- Reentrancy: Guard `repay`, `openLoan`, `reschedule`, `withdraw`.
- DoS: Cap members; one approval per address per request; majority approvals.
- Front‑running: Low surface; sender validation; no auctions.
- Compliance: No PII on‑chain; only hashes/CIDs; issuers whitelisted.
- Operations: Emergency pause; owner/multisig governance.

Full text: `docs/threat-model.md`.

---

## 11) Developer Experience

### Repository Layout
```
linea-microfinance/
├─ contracts/         # Solidity
├─ script/            # Deploy & seed scripts
├─ test/              # Foundry tests
├─ subgraph/          # The Graph
├─ app/               # Next.js app
├─ docs/              # Docs
└─ agents.md          # Multi‑agent coordination log
```

### Environment

Copy `.env.example` → `.env` and set:
- `DIDLAB_RPC_URL`, `PRIVATE_KEY_DEPLOYER`
- `LABUSDT_ADDRESS`, `OWNER_ADDRESS`
- `NEXT_PUBLIC_*` values for the app

### Commands

Contracts
```bash
forge build
forge test -vvv
forge script script/00_deploy_all.s.sol --rpc-url $DIDLAB_RPC_URL --broadcast --legacy --with-gas-price 2gwei
forge script script/01_seed_params.s.sol --rpc-url $DIDLAB_RPC_URL --broadcast --legacy --with-gas-price 2gwei
```

Subgraph
```bash
graph codegen && graph build && graph deploy --product hosted-service <slug>
```

App
```bash
cd app && npm i && npm run dev
```

---

## 12) Known Gaps & Roadmap

- Tests: One open failing path around `CreditLine.openLoan` guard in `test/Credit.t.sol` (approval/exposure gating) — needs investigation.
- App: Wire forms to viem/wagmi (allowance, savings, approvals, open/repay/reschedule); add transaction state UX.
- Subgraph: Deploy and plug endpoint into app; add entity fragments & example queries.
- CI/CD: Add solhint/eslint, gas snapshots, and automated artifact publishing.
- Risk: Expand invariants, add reschedule fee accounting checks, and default cure workflows.

---

## 13) Demo Checklist (Slides)

- Problem: Access to credit via social collateral; limited infra; need transparency.
- Solution: Group lending with savings discipline and joint liability on DIDLab.
- Live Walkthrough: 
  1) Attestation → 2) Savings streak → 3) Group + stake → 4) Approvals → 5) Loan → 6) Repay/Reschedule → 7) Default & Slash → 8) Pause.
- Safety: Guards, events, subgraph, and governance.
- Impact: Low‑cost capital access; transparent risk; scalable ops.

---

## 14) Contacts & Handoff

- Coordination file: `agents.md` (status, TODOs, owners)
- Addresses: `script/addresses.json` (fill post‑deploy)
- Runbook: `docs/runbook.md`
- Parameters: `docs/params.md`

Use this brief to craft a senior‑stakeholder deck or a hands‑on demo.
