# RUNBOOK — SaveTogether

Fresh install and run steps validated by Anika (2024-04-07) on a clean Ubuntu 22.04 VM.

## Prerequisites
- Node.js v20
- pnpm or npm
- Foundry (forge, cast) installed via `foundryup`
- RPC access to https://eth.didlab.org and funded test account

## Setup
```bash
# Clone
 git clone https://github.com/IndrarajBiswas/DeFi-SaveTogether.git
 cd DeFi-SaveTogether

# Environment
 cp .env.example .env
 cp app/.env.example app/.env.local
 export RPC_URL=https://eth.didlab.org
 export PRIVATE_KEY=<test-key>

# Install deps
 pnpm install --frozen-lockfile
 forge install

# Build + test
 forge build
 forge test -vvv

# Start frontend
 cd app && pnpm install --frozen-lockfile && pnpm dev
```

## Seed Data
- Run `forge script script/00_deploy_all.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY` to deploy contracts.
- Execute `forge script script/01_seed_params.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY` to apply governance params.
- Optional: use `script/seed_users.sh` to fund two demo accounts with LabUSDT.

## Known Issues
- RPC latency spikes can cause `eth_estimateGas` errors; rerun with `--legacy` flag if encountered.
- Subgraph dashboard requires local Graph node; if unavailable, the app falls back to direct `viem` event reads.
- Analytics charts occasionally flash during hot reload; harmless and fixed post-freeze (issue #155).

## Verification Log
- Anika ran these steps on 2024-04-07 using fresh VM; all commands succeeded and dashboard loaded streak + approvals.
