# DIDLab Deployment & Reporting Checklist

This document captures the mandatory deployment and reporting steps required by DIDLab for project evaluation. Every team must complete both the on-chain deployment and the accompanying project update.

## 1. DIDLab Network Details
- **Network:** DIDLab (EVM compatible)
- **Chain ID:** 252501
- **RPC Endpoint:** `https://eth.didlab.org`
- **Block Explorer:** https://explorer.didlab.org
- **Faucet:** https://faucet.didlab.org
- **Native Gas Token:** TRUST (ticker: TT)

### Helpful References
- DIDLab documentation: https://api.didlab.org
- API quickstart endpoints:
  - Prepare SIWE message: `POST /v1/siwe/prepare`
  - Verify SIWE signature (returns JWT): `POST /v1/siwe/verify`
  - Upload encrypted IPFS files: `POST /v1/ipfs/upload`
  - Verify CID & payment: `GET /v1/ipfs/verify/:cid`
  - Retrieve bundle metadata: `GET /v1/ipfs/bundle/:bundleCid`
  - Fetch badge metadata: `GET /v1/nft/metadata/:id`
  - Verify badge ownership: `GET /v1/nft/verify?owner=0x…&id=…`

## 2. Deployment Requirements
1. Request testnet gas from the faucet before deploying.
2. Deploy contracts using the DIDLab RPC endpoint and confirm success in the block explorer.
3. Retain deployment artefacts:
   - Contract name(s) and address(es)
   - Deployment transaction hash(es) and block number(s)
   - Deployer wallet address
   - At least one non-view interaction transaction hash
   - ABI location within the repository
4. Store metadata or assets on IPFS when applicable. Record the CID(s), associated files, and purpose (e.g., metadata, artwork, proofs).

## 3. Project Update Template (LMS Submission)
Publish an update in the team LMS folder with the following sections:

### Project Summary
Provide a concise (1–3 sentence) summary of the current project status.

### Deployment Details (EVM)
List, for each deployed contract:
- Contract name and address
- Deployment transaction hash and block number
- Deployer wallet address
- Successful interaction transaction hash (non-view)
- Repository path to the contract ABI

### How to Run
Document exact commands used for:
- Running deployment scripts (e.g., Hardhat or Foundry)
- Executing interaction scripts or calls
- Any IPFS workflows (including the files uploaded and their CID references)

### IPFS Usage (if applicable)
Detail every CID, the asset it represents, and whether encryption was used via the DIDLab API.

### Security Notes
- Enumerate roles (owner, minter, issuer, etc.)
- Confirm that no private keys are committed to the repository
- Reference the `.env.sample` file for expected secret configuration keys

### Final State Hash & Repository Link
Provide the commit hash for the submitted version alongside the repository URL.

## 4. Badge Configuration (Optional)
For teams issuing DIDLab badges:
1. Configure `badges.config.json` with the desired badge definitions.
2. Encrypt metadata and upload it to IPFS using the DIDLab API.
3. Use helper scripts such as `configure_badges.js` for URI setup.
4. Distribute badges via airdrop or permit-sign flows and publish verification instructions (`uri(id)` and `balanceOf(address, id)`).

## 5. Compliance Reminder
- **Both** the DIDLab deployment **and** the LMS project update are mandatory. Missing either requirement results in the project not being evaluated.
- Submit the LMS update only after the deployment is confirmed on https://explorer.didlab.org.

Keep this checklist alongside deployment runbooks to ensure every submission satisfies DIDLab evaluation criteria.
