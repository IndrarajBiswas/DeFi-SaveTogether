# W10 Update — Security & Privacy Sprint

**Status:** ✅ Threat model documented; three mitigations landed

## Progress
- Authored `docs/security/THREAT_MODEL.md` covering assets, trust boundaries, top 5 threats, and mitigation mapping.
- Implemented three mitigations: reentrancy guard on CreditLine, bounded math on streak accumulation, and pause/guardian on lending path.
- Added mitigation-focused test that triggers guard when duplicate repayment is attempted.
- Established SECURITY_NOTES for trust and authZ rule reference.

## Evidence
- CI green with 8 total tests; mitigation test: `testDuplicateRepayBlocked`.
- Threats mapped to mitigations in `docs/security/THREAT_MODEL.md`.
- Security mitigations highlighted in README security section.

## Risks / Dependencies
- Rate-limit/nonce layer for API gateway still stubbed; plan to finish in W11.

## Next Plan
- Instrument latency metric harness for deposits + repayments over 20 calls (W11 requirement).
- Expand coverage and add coverage report target for CI.
