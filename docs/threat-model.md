# Threat Model (MVP)

## Smart Contract Risks

- **Token handling** – All USDC transfers use `SafeERC20`. Pull-based transfers prevent unexpected reentrancy.
- **Reentrancy** – `CreditLine`, `SavingsPool`, and `GroupVault` wrap state-changing methods with `ReentrancyGuard` and follow Checks-Effects-Interactions.
- **Privilege misuse** – Only governance (multisig) can pause, update parameters, or seed issuers. Deployment scripts set ownership on deployment.
- **Approval spoofing** – Each group member can approve a loan only once per request. Group size is capped to limit DoS.
- **Default handling** – `markDefault` can be called permissionlessly but enforces grace-period and outstanding-balance checks before slashing stake.

## Economic / Business Risks

- **Group exposure** – `groupMaxExposure` parameter limits total outstanding principal per group. Staking requirement (5%) provides backstop.
- **Savings discipline** – Originations require a minimum streak of weekly deposits (tracked on-chain) to reduce first-loan risk.
- **Fee leakage** – Platform fee is assessed only after principal + interest is fully repaid. Treasury ownership is restricted to governance.

## Operational Risks

- **Pause / Emergency** – `GovernanceLite` exposes `pause`/`unpause`. Runbook documents how to activate during incidents.
- **KYC compliance** – Attestations reference off-chain verifiable credentials. Only whitelisted issuers can mark eligibility.
- **Data privacy** – No PII is stored on-chain. Attestations should reference hashed documents (IPFS/Arweave CIDs).

## Future Work

- Integrate automated alerts for defaults and stake slashing.
- Add explicit rate limiting on originations per borrower.
- Expand invariant testing and fuzzing for repayment/reschedule edge cases.
