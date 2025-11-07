# DIDLab Microfinance Documentation Hub

Welcome! This hub is the canonical entry point for engineers, operators, and stakeholders working on the DIDLab Microfinance MVP. It provides deep dives, playbooks, and context that build on the high-level overview in the repository [README](../../README.md).

## How to Use This Hub

1. **Start with the system overview** to understand the moving pieces and how they interact.
2. **Follow the getting started track** to install dependencies and run each stack locally.
3. **Reference the operational guides** when deploying, updating parameters, or responding to incidents.
4. **Share the executive brief** when onboarding new stakeholders or pitching the pilot.

## System Overview

DIDLab Microfinance combines on-chain contracts, an indexing layer, and a Next.js web application to deliver Grameen-style joint-liability lending on the DIDLab Trust network. A high-level diagram is available in [`docs/architecture.md`](../architecture.md), which covers:

- Contract responsibilities and key safeguards.
- Data flow between the SavingsPool, GroupVault, and CreditLine contracts.
- How the subgraph and frontend consume emitted events.
- Operational touchpoints for governance and deployments.

## Document Map

| Guide | Audience | Summary |
| --- | --- | --- |
| [01_getting_started.md](./01_getting_started.md) | Developers | Step-by-step environment setup, contract compilation, testing, and frontend launch instructions. |
| [02_smart_contracts.md](./02_smart_contracts.md) | Protocol engineers | Detailed walkthrough of the Solidity contracts, role management, and guard rails. |
| [03_frontend_app.md](./03_frontend_app.md) | Frontend engineers | Explanation of the Next.js structure, wagmi/viem hooks, and page-level responsibilities. |
| [04_subgraph.md](./04_subgraph.md) | Data & analytics | Subgraph schema, handlers, and deployment workflow. |
| [05_deployment_runbook.md](./05_deployment_runbook.md) | DevOps / protocol ops | Deploy, verify, and promote contracts across environments with smoke-test checklists. |
| [06_governance_and_security.md](./06_governance_and_security.md) | Governance, risk | Governance processes, emergency controls, parameter adjustments, and security posture. |

Additional resources:

- [`../params.md`](../params.md) – Default parameter catalog for governance reviews.
- [`../runbook.md`](../runbook.md) – Tactical operations playbook for day-to-day management.
- [`../threat-model.md`](../threat-model.md) – Threat modeling and mitigation checklist.
- [`../../presentation.md`](../../presentation.md) – Executive briefing for partners and field teams.

## Maintainers & Contact

- **Product / Strategy:** Coordinate roadmap changes, pilot criteria, and stakeholder updates.
- **Protocol Engineering:** Own smart contract development, audits, and parameter recommendations.
- **Frontend & Subgraph:** Manage the user experience, data visualizations, and API integrations.
- **Operations:** Execute deployments, monitor health, and handle emergency procedures.

Need help or have suggestions? Open an issue in GitHub or tag the relevant maintainer in the #didlab-microfinance channel.
