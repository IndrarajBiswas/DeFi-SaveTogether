# Runbook – Deploy & Operate

## 1. Pre-flight Checklist

1. Export environment variables (see `.env.example`).
2. Confirm deployer wallet funded with TRUST (TT) for gas and LabUSDT for liquidity.
3. Ensure Foundry and npm dependencies are installed.
4. Collect latest parameter sheet from risk team.

## 2. Deploy to DIDLab (Evaluation Requirement)

1. Fund the deployer wallet with TRUST (TT) from https://faucet.didlab.org.
2. Point scripts at the DIDLab RPC (`https://eth.didlab.org`, chain ID `252501`).
3. Deploy contracts and verify addresses/transactions on https://explorer.didlab.org.
4. Record the artefacts required by the LMS update (see `docs/didlab-deployment.md`).

```bash
forge build
forge script script/00_deploy_all.s.sol \
  --rpc-url https://eth.didlab.org \
  --broadcast \
  --legacy \
  --with-gas-price 2gwei
```

After deployment, capture at least one state-changing transaction (e.g., seeding parameters or creating a group) to reference in the project update.

## 3. Smoke Tests

1. Attest a pilot wallet via `AttestationRegistry.attest`.
2. Create a group, lock stake, and approve a dummy loan.
3. Open a small loan and execute a repayment.
4. Verify events in the subgraph and Treasury fee balance.

## 4. Rollback / Emergency Procedure

1. Pause protocol:
   ```bash
   cast send <GOVERNANCE_ADDRESS> "pause()" --rpc-url $DIDLAB_RPC_URL --private-key $PRIVATE_KEY_DEPLOYER
   ```
2. Diagnose issue; if contract upgrade required, redeploy and migrate state.
3. Once resolved, `unpause()` and notify stakeholders.

## 5. Monitoring & Maintenance

- Track `Defaulted`, `GroupSlashed`, and `ParamUpdated` events via subgraph dashboards.
- Review savings streak distributions weekly.
- Rotate issuer allowlist via `AttestationRegistry.setIssuer` when onboarding/offboarding partners.
