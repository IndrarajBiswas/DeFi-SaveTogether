# Changelog

## [v0.9.0] — Week 13 Freeze (2024-04-07)
- MVP scope frozen: savings streaks, group loan approvals, credit line repayment.
- Security mitigations: reentrancy guard, streak caps, pause/guardian role.
- Analytics dashboard beta and latency harness shipped.
- RUNBOOK validated by peer; all P0/P1 items closed.

## [v0.8.0] — Week 10 Security Sprint (2024-03-24)
- Threat model authored with top 5 risks and mapped mitigations.
- Authorization enforced for group approvals; unauthorized calls revert.
- Added mitigation test coverage and tightened deposit validation.

## [v0.7.0] — Week 8 Core Feature (2024-03-10)
- Core savings deposit + streak feature complete with event subscriptions.
- Frontend dashboard surfaces live streak counts from event logs.
- Negative deposit paths covered by tests.

## [v0.6.0] — Week 6 Skeleton (2024-02-25)
- Repository skeleton established (Foundry contracts, Next.js app, CI workflow).
- Initial smoke test and deployment scripts created.
