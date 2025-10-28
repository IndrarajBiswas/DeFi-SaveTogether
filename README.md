# Linea Microfinance – Grameen-style Group Lending (MVP)

End-to-end mono-repo for a joint-liability microfinance network on Linea. The stack covers on-chain savings/credit primitives, a subgraph indexer, deployment scripts, docs, and a pilot-ready web app targeting Linea Sepolia → Linea Mainnet.

## Repository Layout

```
contracts/              Solidity sources (Foundry)
script/                 Deployment + configuration scripts
test/                   Foundry unit/property tests
subgraph/               The Graph schema & mappings
app/                    Next.js app & SDK glue
docs/                   Parameters, threat model, runbook
```

## Prerequisites

- Node.js ≥ 18 (Node 20 recommended for React Native peer dependencies)
- npm or pnpm
- [Foundry](https://book.getfoundry.sh/) (`foundryup`)
- (Optional) Graph CLI for subgraph workflows

## Quick Start

```bash
# Install Foundry toolchain
curl -L https://foundry.paradigm.xyz | bash
~/.foundry/bin/foundryup

# Clone dependencies
cd linea-microfinance
~/.foundry/bin/forge install OpenZeppelin/openzeppelin-contracts foundry-rs/forge-std --no-git

# Install web app deps
cd app
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and populate RPC URLs, deployer key, stablecoin addresses, and governance owner. These values are used by Foundry scripts, the frontend, and dev tooling.

```
cp .env.example .env
```

## Contracts & Tests

```bash
# From repo root
~/.foundry/bin/forge build
~/.foundry/bin/forge test -vvv
```

Highlights:
- `CreditLine` enforces attestations, savings streaks, exposure caps, and stake slashing.
- `SavingsPool` maintains weekly savings streaks and balances.
- `GroupVault` tracks membership, approvals, and slashable stake.

Coverage targets and invariants should be extended as functionality matures.

## Deployment Workflow

1. Set `LINEA_SEPOLIA_RPC_URL`, `PRIVATE_KEY_DEPLOYER`, `USDC_ADDRESS_SEPOLIA`, etc.
2. Deploy contracts and wire roles:

   ```bash
   forge script script/00_deploy_all.s.sol --rpc-url $LINEA_SEPOLIA_RPC_URL --broadcast
   forge script script/01_seed_params.s.sol --rpc-url $LINEA_SEPOLIA_RPC_URL --broadcast
   ```

3. Record addresses in `script/addresses.json` and share with frontend/subgraph teams.
4. Operational guidance (pause, rollout, rollback) lives in `docs/runbook.md`.

## Subgraph

- Schema: `subgraph/schema.graphql`
- Mapping handlers: `subgraph/src/mapping.ts`

Example pipeline:

```bash
graph codegen
graph build
graph deploy --product hosted-service <slug>
```

## Web App (Next.js + wagmi/viem)

Located under `app/`, the frontend covers all pilot flows: onboarding, savings, group formation, loan origination/approvals, repayments, and admin actions.

```bash
cd app
npm install          # once
npm run dev          # http://localhost:3000
npm run build        # production bundle
```

Pages & responsibilities:
- `/` – Overview, onboarding checklist, quick stats
- `/savings` – Deposit/withdraw, streak tracker, USDC allowance helper
- `/groups` – Create/join groups, lock stake, approval status
- `/loans` – Eligibility checks, request + approval UX, repayment schedule
- `/admin` – Attest users, adjust parameters, pause/unpause platform

Each page highlights pre-checks (attestation level, savings streak, exposure) and links to the relevant smart-contract actions.

## Documentation

- `docs/params.md` – governance parameter defaults
- `docs/threat-model.md` – key risk considerations
- `docs/runbook.md` – deploy/rollback cookbook

## Status Checklist

- [x] Contracts compile with Foundry
- [x] Baseline Foundry tests in place
- [x] Deployment scripts scaffolded
- [x] Subgraph schema & mappings generated
- [x] Frontend pages scaffolded across flows
- [x] Repository documentation updated

### Post-MVP Enhancements

- Expand coverage & invariants (savings streak edge cases, repayment schedules)
- Integrate live subgraph queries into the app
- Harden default detection/rescheduling logic & fee accounting
- Automate CI (lint, tests, app build, subgraph build, deployment)
