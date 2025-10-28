# Governance and Security

This document provides a detailed overview of the governance model and security considerations for the Linea Microfinance platform.

## Governance Model

The governance of the platform is designed to be simple and effective in its early stages, with a clear path towards greater decentralization in the future.

### `GovernanceLite.sol`

In the current implementation, governance is managed through the `GovernanceLite.sol` contract. This contract is controlled by a single owner, who has the authority to set the platform's parameters. This centralized approach allows for rapid decision-making and iteration during the early stages of the project.

**Key Governance Parameters:**

*   `minAttestationLevel`: The minimum KYC level required for a user to be eligible for a loan.
*   `rateBpsPer4Weeks`: The interest rate charged on loans.
*   `platformFeeBps`: The fee collected by the platform on fully repaid loans.
*   `minPrincipal` and `maxPrincipal`: The minimum and maximum amounts that can be borrowed in a single loan.
*   `groupMaxExposure`: The maximum amount of outstanding debt that a single group can have.

### The Path to Decentralization

While the current model is centralized, the long-term vision is to transition to a more decentralized governance structure. This could involve:

*   **Multi-Sig Wallet**: Transferring ownership of the `GovernanceLite` contract to a multi-signature wallet controlled by a committee of trusted individuals.
*   **DAO**: Establishing a Decentralized Autonomous Organization (DAO) where token holders can vote on proposals to change the platform's parameters.

## Access Control

The platform uses a role-based access control system, built on top of OpenZeppelin's `AccessControl` contract. This ensures that sensitive functions can only be executed by authorized addresses.

**Key Roles:**

*   **`DEFAULT_ADMIN_ROLE`**: This is the highest level of authority. The address with this role can grant and revoke all other roles.
*   **`GOVERNANCE_ROLE`**: This role is intended for the governance contract or a multi-sig wallet. It has the authority to manage the platform's parameters.
*   **`CREDITLINE_ROLE`**: This role is granted to the `CreditLine` contract, allowing it to call the `slashOnDefault()` function in the `GroupVault` contract.
*   **`BORROWER_ROLE` (Proposed)**: As suggested in the security improvements, a `BORROWER_ROLE` should be added to restrict the `openLoan()` function to attested users.

## Security Considerations

Security is a top priority for the Linea Microfinance platform. The following are some of the key security considerations that have been taken into account.

### Smart Contract Audits

Before deploying to a mainnet, it is essential to have the smart contracts audited by a reputable security firm. An audit can help to identify potential vulnerabilities and provide recommendations for improvement.

### Threat Model

The `docs/threat-model.md` file contains a detailed analysis of the potential threats to the platform and the mitigations that are in place to address them. The key threats include:

*   **Smart contract vulnerabilities**: Bugs in the code that could be exploited by attackers.
*   **Economic attacks**: Attempts to manipulate the platform's economic incentives for personal gain.
*   **Centralization risks**: The risk of the owner of the `GovernanceLite` contract acting maliciously.

### Best Practices

The contracts are written with security best practices in mind:

*   **Re-entrancy Guards**: The `nonReentrant` modifier is used on key functions to prevent re-entrancy attacks.
*   **SafeMath**: Although Solidity 0.8+ has built-in overflow and underflow checks, the use of a `Maths` library is still a good practice for complex calculations.
*   **Separation of Concerns**: The modular architecture of the contracts reduces the attack surface of each individual contract.
*   **Pausable**: The `Pausable` contract is used to allow for an emergency stop in case of a critical vulnerability.

---

This concludes the main documentation for the Linea Microfinance project. You should now have a comprehensive understanding of the platform and how it works.
