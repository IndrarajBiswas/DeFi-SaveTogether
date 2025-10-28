# Governance & Risk Parameters

All stablecoin values are expressed in USDC with 6 decimals unless noted.

| Key | Default | Description |
| --- | --- | --- |
| `minAttestationLevel` | 1 | Minimum KYC attestation level required to originate loans. |
| `rateBpsPer4Weeks` | 200 | Simple interest rate per 4-week block (2.00%). |
| `platformFeeBps` | 50 | Platform fee (0.50%) charged on principal at full repayment. |
| `minPrincipal` | 25e6 | Minimum loan size (25 USDC). |
| `maxPrincipal` | 250e6 | Maximum loan size for MVP (250 USDC). |
| `terms` | [4, 8, 12] | Supported term lengths in weeks. |
| `graceDays` | 7 | Grace period after scheduled maturity before default. |
| `groupStakeBps` | 500 | Required stake (5%) relative to maximum group exposure. |
| `groupMaxExposure` | 2000e6 | Maximum outstanding principal per group (2,000 USDC). |

> ⚠️ Adjustments should be coordinated with risk and product stakeholders. Record each change via `GovernanceLite.ParamUpdated` events and update this table accordingly.
