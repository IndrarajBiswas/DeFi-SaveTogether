# W11 Metrics — Latency & Reliability

## Metric Goal
Measure end-to-end deposit latency across 20 sequential calls and capture reliability under invalid inputs.

## How to Run
1. Ensure RPC URL exported: `export RPC_URL=https://eth.didlab.org`.
2. Run latency harness (uses viem + Foundry broadcast script):
   ```bash
   pnpm install --frozen-lockfile
   pnpm exec ts-node scripts/latency.ts --iterations 20 --rpc $RPC_URL --pool $SAVINGS_POOL_ADDRESS
   ```
3. For reliability invalid-input test, run:
   ```bash
   forge test --match-test testDepositRejectsZero --fork-url $RPC_URL
   ```

## Results (Week 11)
| Metric | Median | P90 | Notes |
|--------|--------|-----|-------|
| Deposit latency (20 calls) | 1.32s | 1.76s | Cached nonce batching reduced tail |
| Reliability error rate (invalid deposits) | 0% accepted | n/a | All zero-amount attempts reverted |

![Latency boxplot](../presentation/latency-boxplot.png)

## Reproducibility Notes
- Harness prints JSON summary to stdout for CI ingestion; attach output in PR.
- Use the same funded test account with prepaid gas to reduce variance.

## LLM/Audit Appendix
- Prompt file: `docs/metrics/prompts/w11_audit_prompt.txt` (scripted questions about bounds and reentrancy).
- Finding applied: streak counter was missing upper bound; fixed in `SavingsPool` and covered by `testStreakCapsAtMax`.
