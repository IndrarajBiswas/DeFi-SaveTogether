# Security Notes

## Trust Assumptions
- DIDLab validator set is honest-majority; RPC endpoint may reorder but will not fabricate blocks.
- Users interact via wallet-signed transactions; frontend never holds private keys.
- AttestationRegistry currently relies on issuer allowlist maintained by governance multisig.

## Authorization Rule (Feature 2)
- **Protected action:** Approving a group loan proposal.
- **Enforcement point:** `GroupVault.approveLoan` checks that `msg.sender` holds a valid membership attestation for the group and that the group is active. Non-members revert with `NotGroupMember`.
- **Quorum:** 3-of-5 approvals required; enforced on-chain with per-group bitmaps to prevent duplicate votes.
- **Defense-in-depth:** API gateway will additionally verify membership proof hash and apply nonce/rate limits before relaying transaction.

## Key Mitigations
- Reentrancy guard on all state-changing CreditLine functions.
- Deposit and streak math bounded to prevent overflow/underflow abuse.
- Pause/guardian role allows halting lending in case of anomaly.
