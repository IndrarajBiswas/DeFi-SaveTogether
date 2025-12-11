# Demo Script — SaveTogether Dry Run (5 minutes)

## Goals
- Show value prop: trustless group savings & lending with streak rewards.
- Demonstrate one metric (latency) and one security mitigation (reentrancy guard) live.

## Setup (Pre-demo)
1. Export RPC + keys: `export RPC_URL=https://eth.didlab.org` and `export PRIVATE_KEY=$DEMO_KEY`.
2. Deploy/seed (if needed): `forge script script/00_deploy_all.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY`.
3. Start frontend: `cd app && pnpm dev` (browser at http://localhost:3000).

## Flow
1. **Intro (30s)** — 1-liner: "SaveTogether lets small groups build credit through weekly deposits and community-approved loans."
2. **Deposit & Streak (90s)**
   - Click "Deposit 10 LabUSDT" in dashboard or run `cast send $SAVINGS_POOL "deposit(uint256)" 10000000 --private-key $PRIVATE_KEY --rpc-url $RPC_URL`.
   - Expected: toast success, streak counter increments, event row appears in Activity table.
   - Highlight metric panel showing median latency from latest run (~1.3s).
3. **Group Loan Approval (90s)**
   - From dashboard, create loan request with amount + reason.
   - As second actor (pre-funded demo account), approve via button or CLI: `cast send $GROUP_VAULT "approveLoan(uint256)" 1 --private-key $APPROVER_KEY --rpc-url $RPC_URL`.
   - Expected: approval count increases; once 3-of-5 reached, `LoanApproved` event emitted and CreditLine funds borrower.
   - Show unauthorized path: trigger approval from non-member; CLI returns revert `NotGroupMember`.
4. **Security Mitigation (30s)**
   - Run replay attack attempt: `cast send $CREDIT_LINE "repay(uint256,uint256)" 1 0 --private-key $PRIVATE_KEY --rpc-url $RPC_URL` twice.
   - Expected: second call reverts due to reentrancy/idempotency guard.
5. **Metric Call-out (30s)**
   - Run `pnpm exec ts-node scripts/latency.ts --iterations 5 --rpc $RPC_URL --pool $SAVINGS_POOL`.
   - Show printed JSON summary and reference W11 metrics doc.
6. **Close (30s)** — Call-to-action: "Groups can unlock low-interest credit with transparent rules; next we add mobile support."

## Fallback Path
- If frontend fails, use CLI commands above and read streak via `cast call $SAVINGS_POOL "streak(address)(uint256)" $DEMO_ADDRESS`.
- If RPC unstable, switch to backup RPC (`https://rpc2.didlab.org`) and replay harness with 3 iterations.

## References
- Metrics: `docs/metrics/W11_METRICS.md` (latency harness, plots).
- Security: `docs/security/THREAT_MODEL.md`, `SECURITY_NOTES.md`.
- Feedback issues to address before final: #150 (UI loading states), #151 (RPC fallback toggle), #152 (poster CTA font contrast).
