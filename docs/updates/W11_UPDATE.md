# W11 Update — Testing & Metrics

**Status:** ✅ Metric captured; tests at 10+

## Progress
- Built latency harness documented in `docs/metrics/W11_METRICS.md` measuring 20-call deposit latency.
- Increased total tests to 10 including invalid input reliability cases.
- Added optional coverage command to CI notes (Foundry `forge coverage`).
- Collected screenshot/plot of latency distribution and embedded in metrics doc.

## Evidence
- CI run green with expanded suite; metric reproducible via `pnpm exec ts-node scripts/latency.ts` or `forge test --match-path test`.
- Metrics table + plot located in `docs/metrics/W11_METRICS.md`.

## Risks / Dependencies
- Need to stabilize RPC variability; latency harness uses median to reduce outlier impact.

## Next Plan
- Choose LLM-assisted audit vs analytics dashboard for Week 12 value-add (leaning analytics using event stream).
