# Smart Contracts

This document provides a detailed explanation of the smart contracts that form the core of the DIDLab Microfinance platform. All contracts are written in Solidity and designed to be modular and upgradeable.

## Contract Architecture

The smart contract system is composed of several interconnected contracts, each with a specific responsibility. This separation of concerns makes the system more secure and easier to manage.

*   **`CreditLine.sol`**: The central contract that orchestrates the entire loan lifecycle.
*   **`GroupVault.sol`**: Manages group memberships, stake, and loan approvals.
*   **`SavingsPool.sol`**: Handles user savings and tracks savings streaks.
*   **`AttestationRegistry.sol`**: A simple registry for KYC attestations.
*   **`GovernanceLite.sol`**: A contract for managing system parameters.
*   **`Treasury.sol`**: Collects platform fees.

## 1. `CreditLine.sol`

The `CreditLine` contract is the heart of the platform. It is responsible for:

*   Opening new loans.
*   Tracking loan repayments.
*   Handling defaults and slashing.
*   Enforcing the rules and requirements of the platform.

### Key Functions

*   `openLoan()`: This function allows a user to open a new loan. It performs a series of checks to ensure the user is eligible, the loan parameters are valid, and the user's group has approved the loan.
*   `repay()`: Allows a user to repay a portion of their loan. It updates the loan's status and, if the loan is fully repaid, it collects a platform fee.
*   `markDefault()`: This function can be called to mark a loan as defaulted if it is not repaid on time. It triggers the slashing of the group's stake.
*   `reschedule()`: Allows a borrower to extend the term of their loan for a small fee.

### Interactions

The `CreditLine` contract interacts with several other contracts:

*   It checks the `AttestationRegistry` to ensure the borrower has the required KYC level.
*   It queries the `SavingsPool` to verify the borrower's savings history (though this is not implemented in the current version).
*   It checks the `GroupVault` to confirm that the borrower's group has approved the loan and has sufficient stake.
*   It reads loan parameters (like interest rates and maximum loan amounts) from the `GovernanceLite` contract.
*   It sends platform fees to the `Treasury`.

## 2. `GroupVault.sol`

The `GroupVault` contract is responsible for managing all aspects of user groups.

### Key Functions

*   `createGroup()`: Allows a user to create a new group with a list of members and a minimum number of approvals required for a loan.
*   `lockStake()`: Allows group members to deposit their savings into the group's vault as a stake.
*   `approveLoan()`: Allows a group member to approve a loan for another member of the same group.
*   `slashOnDefault()`: This function is called by the `CreditLine` contract when a loan defaults. It reduces the group's stake by a specified amount.

## 3. `SavingsPool.sol`

The `SavingsPool` contract is a simple contract for managing user savings.

### Key Functions

*   `deposit()`: Allows a user to deposit LabUSDT into the savings pool. It also tracks the user's weekly savings streak.
*   `withdraw()`: Allows a user to withdraw their savings.
*   `consecutiveWeeks()`: Returns the number of consecutive weeks a user has made a deposit.

## 4. `AttestationRegistry.sol`

This contract provides a simple mechanism for Know Your Customer (KYC) attestations.

### Key Functions

*   `attest()`: Allows a whitelisted issuer to attest that a user has completed a certain level of KYC.
*   `setIssuer()`: Allows the owner of the contract to add or remove whitelisted issuers.
*   `isEligible()`: Checks if a user has a certain minimum KYC level.

## 5. `GovernanceLite.sol`

`GovernanceLite` is a simple, owner-controlled contract for managing the platform's parameters.

### Key Parameters

*   `minAttestationLevel`: The minimum KYC level required to take out a loan.
*   `rateBpsPer4Weeks`: The interest rate for loans.
*   `platformFeeBps`: The fee charged on fully repaid loans.
*   `minPrincipal` and `maxPrincipal`: The minimum and maximum loan amounts.
*   `groupMaxExposure`: The maximum total outstanding debt a group can have.

## 6. `Treasury.sol`

The `Treasury` contract is a simple vault that collects the platform fees. The owner of the contract can then withdraw these fees.

---

Next, read the **[Frontend Application](./03_frontend_app.md)** documentation to learn about the user-facing component of the platform.
