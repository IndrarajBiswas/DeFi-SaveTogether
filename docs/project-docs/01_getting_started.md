# Getting Started

This guide provides step-by-step instructions for setting up your development environment, building the smart contracts, running tests, and launching the web application.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or higher. We recommend using Node.js 20, as it is required for some React Native peer dependencies.
*   **npm or pnpm**: A package manager for Node.js.
*   **Foundry**: A fast, portable, and modular toolkit for Ethereum application development. You can install it by running `foundryup`.

## 1. Setting Up the Environment

### 1.1. Install Foundry

If you don't have Foundry installed, open your terminal and run the following command:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

After the installation is complete, run `foundryup` to install the latest version of the Foundry toolchain:

```bash
~/.foundry/bin/foundryup
```

### 1.2. Clone the Repository

Clone the Linea Microfinance repository to your local machine:

```bash
git clone <your-repository-url>
cd linea-microfinance
```

### 1.3. Install Dependencies

The project is a monorepo with dependencies for both the smart contracts and the frontend application.

**Smart Contract Dependencies:**

From the root of the project, install the required libraries (OpenZeppelin and forge-std):

```bash
~/.foundry/bin/forge install OpenZeppelin/openzeppelin-contracts foundry-rs/forge-std --no-git
```

**Frontend Dependencies:**

Navigate to the `app` directory and install the Node.js dependencies:

```bash
cd app
npm install
```

### 1.4. Environment Variables

The project uses a `.env` file to manage environment variables for RPC URLs, deployer keys, and other sensitive information.

1.  Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2.  Open the `.env` file and populate it with your own values. You will need:
    *   An RPC URL for the Linea Sepolia testnet.
    *   A private key for the deployer account.
    *   The address of a USDC stablecoin contract on Linea Sepolia.
    *   An address for the governance owner.

## 2. Building and Testing the Smart Contracts

All smart contract commands should be run from the root of the project.

### 2.1. Build the Contracts

To compile the Solidity source code, run the following command:

```bash
~/.foundry/bin/forge build
```

This will create the contract artifacts in the `out/` directory.

### 2.2. Run the Tests

The project includes a suite of unit and property tests for the smart contracts.

To run the tests, use the following command:

```bash
~/.foundry/bin/forge test -vvv
```

The `-vvv` flag provides verbose output, showing the results of each test case.

## 3. Running the Frontend Application

To run the Next.js web application, navigate to the `app` directory.

### 3.1. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`.

### 3.2. Build for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

This will generate an optimized build in the `.next/` directory.

## 4. Deploying the Smart Contracts

Deployment is handled by Foundry scripts. Before deploying, ensure your `.env` file is correctly configured with the deployer's private key and the appropriate RPC URL.

### 4.1. Deploy the Contracts

Run the following script to deploy all the contracts and configure their initial roles:

```bash
forge script script/00_deploy_all.s.sol --rpc-url $LINEA_SEPOLIA_RPC_URL --broadcast
```

### 4.2. Seed the Governance Parameters

After deployment, you need to seed the initial governance parameters:

```bash
forge script script/01_seed_params.s.sol --rpc-url $LINEA_SEPOLIA_RPC_URL --broadcast
```

### 4.3. Record the Addresses

After deployment, the addresses of the deployed contracts will be saved in `script/addresses.json`. These addresses are needed for the frontend application and the subgraph.

---

Next, you should read the **[Smart Contracts](./02_smart_contracts.md)** documentation to understand the on-chain logic of the platform.
