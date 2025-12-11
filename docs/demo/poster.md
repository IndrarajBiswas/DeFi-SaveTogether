# SaveTogether Poster (Draft)

> Blockchain-powered group savings and lending on the DIDLab Trust network.

## 1) Problem
- High-interest microloans (20–40%) trap borrowers.
- Informal savings circles lack transparency and dispute resolution.
- Limited credit history blocks access to fair lending.

## 2) Solution
- **Weekly savings streaks** to build creditworthiness.
- **Group approvals (3-of-5 multisig)** enforce shared accountability.
- **Joint liability vaults** secure collateral and slash on default.
- **Transparent on-chain ledger** with auditable events and dashboards.

## 3) How It Works
1. Users create a savings group and deposit LabUSDT weekly.
2. Deposits mint **Streak Points**; missed weeks reset the streak.
3. Loan requests require **3-of-5 group approvals** via `GroupVault`.
4. Funds move through **SavingsPool → GroupVault → CreditLine** with emitted events.
5. Repayments restore stake; defaults trigger collateral slashing to Treasury.

## 4) Architecture (W7 vertical slice highlighted)
- **Frontend:** Next.js + wagmi + Tailwind CSS
- **Smart Contracts:** `SavingsPool`, `GroupVault`, `CreditLine`, `Treasury`, `GovernanceLite`, `AttestationRegistry`
- **Network:** DIDLab Trust (Chain ID 252501, RPC `eth.didlab.org`)
- **Indexing:** Optional subgraph for analytics
- **Observable path:** CLI deposit → `SavingsPool.deposit` → `Deposited` event → readback in client.

## 5) Traction & Metrics
- Tests: ≥12 (Foundry) with negative cases for invalid deposits and unauthorized approvals.
- Latency metric (W11): ~420 ms p50 across 20 RPC calls; error rate <2% on invalid inputs.
- Security mitigations: input validation, pause/guarded parameter updates, bounded math.

## 6) Demo Flow (5 minutes)
1. **Hook (30s):** Inequity of microloans and how SaveTogether reduces cost via transparency.
2. **Create Group (45s):** Deploy group vault, show address/ID.
3. **Deposit (60s):** Execute weekly deposit; display `Deposited` event and streak counter.
4. **Approve Loan (60s):** Show 3-of-5 approvals; unauthorized call rejected.
5. **Repay & Slash (45s):** Happy path repayment, then show failed repayment triggering slash safeguard.
6. **Call to Action (30s):** Invite pilot partners (community banks, NGOs) and DAO governance voters.

## 7) Security & Privacy
- Threats: replay/spam deposits, unauthorized approvals, reentrancy in vault, overflow on streak math.
- Mitigations: nonces on approvals, role/allow-list enforcement, `ReentrancyGuard`, `SafeMath`-style bounded operations, pause guard for emergencies.
- Trust: DIDLab RPC, signer wallets, subgraph indexer.

## 8) Roadmap
- **Polish (W13):** Freeze MVP, runbook verification, UI loading states.
- **Dry Run (W14):** Demo script, poster refinement, capture 3-minute clip.
- **Final (W15–W16):** Gas optimizations, mobile-friendly UI, attestations for KYC tiers.

## 9) Contact & Links
- Repo: https://github.com/IndrarajBiswas/DeFi-SaveTogether
- Board: https://github.com/orgs/IndrarajBiswas/projects/1
- Demo script: `docs/demo/DEMO_SCRIPT.md`
- Threat model: `docs/security/THREAT_MODEL.md`
