# Threat Model — SaveTogether

## Assets
- Member balances and group stakes in `SavingsPool`, `GroupVault`, and `CreditLine`.
- Governance parameters (interest rate, quorum, pause state) controlled by DAO multisig.
- Identity attestations recorded in `AttestationRegistry` and mirrored in frontend allowlist.
- Event streams consumed by dashboard and analytics.

## Trust Boundaries
- **Client → Gateway:** Next.js app or CLI signs transactions; RPC provider assumed honest-but-curious.
- **Gateway → Contracts:** DIDLab network; contracts enforce all critical invariants on-chain.
- **Off-chain Indexing:** Subgraph/dashboard consumes events; integrity verified via chain data.
- **LLM Audit Flow:** Prompt + response stored locally; fixes vetted via tests before merge.

## Top Threats & Mitigations
| # | Threat | Mitigation | Evidence |
|---|--------|------------|----------|
| 1 | Reentrancy on CreditLine repay/withdraw | Added OpenZeppelin `ReentrancyGuard` and nonReentrant modifier | `CreditLine` guard + test `testDuplicateRepayBlocked` |
| 2 | Unbounded streak growth leading to overflow incentives | Added bounded math with caps and CheckedMath | Tests covering streak cap | 
| 3 | Unauthorized loan approvals | Role-enforced approvals via membership attestations; revert `NotGroupMember` | Test `testApproveLoanAuthorization` |
| 4 | Denial-of-service via excessive repayment calls | Pause/guardian toggle on lending path + idempotent repay guard | Guard documented in README + tests | 
| 5 | Frontend API spam | Nonce/rate-limit middleware stubbed; to be enabled in API gateway (tracked issue #142) | Issue link + TODO in RUNBOOK |

## Privacy Considerations
- Group membership proofs hashed client-side before submission (planned for W10–W12; prototype completed).
- Analytics dashboard aggregates streak health metrics; no PII stored, wallet addresses masked when displayed publicly.

## Testing Hooks
- Mitigation coverage achieved with ≥8 tests; failure-path tests ensure unauthorized callers are blocked and reentrancy attempts fail.
- CI requires all tests green before merge; coverage target optional but recommended.
