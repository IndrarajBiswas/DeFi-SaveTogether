# Frontend Application

This document provides an overview of the Next.js web application that serves as the primary user interface for the Linea Microfinance platform.

## Technology Stack

The frontend is built with modern web technologies:

*   **Next.js**: A popular React framework for building server-rendered and statically generated web applications.
*   **TypeScript**: A statically typed superset of JavaScript that enhances code quality and maintainability.
*   **wagmi**: A set of React Hooks that makes it easy to interact with Ethereum smart contracts.
*   **viem**: A lightweight and efficient library for interacting with the Ethereum blockchain.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.

## Project Structure

The frontend code is located in the `app/` directory. Here is an overview of the key subdirectories:

*   `pages/`: Contains the main pages of the application. Each file in this directory corresponds to a route.
*   `components/`: Contains reusable React components used throughout the application.
*   `lib/`: Contains utility functions and the configuration for `wagmi` and `viem`.
*   `styles/`: Contains global CSS styles.

## Pages and Features

The application provides a comprehensive set of features for all user flows of the microfinance platform.

### `/` (Home)

The home page provides an overview of the platform, a checklist for new users to get started, and some quick statistics about the platform's activity.

### `/savings`

This page is for managing user savings. It allows users to:

*   Deposit and withdraw USDC.
*   Track their weekly savings streak.
*   Approve the `SavingsPool` contract to spend their USDC.

### `/groups`

This page is for managing user groups. It allows users to:

*   Create a new group.
*   Join an existing group.
*   Lock their stake in the group's vault.
*   View the status of their group and its members.

### `/loans`

This page is for managing loans. It allows users to:

*   Check their eligibility for a loan.
*   Request a new loan.
*   View the status of their loan application and the group's approvals.
*   Repay their loan.

### `/admin`

This page is for platform administrators. It provides access to administrative functions, such as:

*   Attesting new users.
*   Adjusting the governance parameters.
*   Pausing and unpausing the platform.

## Interacting with Smart Contracts

The frontend uses the `wagmi` library to interact with the smart contracts. The `wagmi` configuration can be found in `lib/viem.ts`. This file sets up the connection to the blockchain and defines the contract ABIs and addresses.

Throughout the application, `wagmi`'s React Hooks are used to:

*   Read data from the smart contracts (e.g., a user's balance, the status of a loan).
*   Write data to the smart contracts (e.g., depositing savings, creating a group, repaying a loan).

This approach provides a seamless and reactive user experience, with the UI automatically updating in response to changes on the blockchain.

---

Next, read the **[Subgraph (Data Indexing)](./04_subgraph.md)** documentation to understand how the platform's data is indexed and queried.
