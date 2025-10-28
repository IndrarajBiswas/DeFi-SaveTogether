# Linea Microfinance Documentation

Welcome to the official documentation for the Linea Microfinance project. This documentation provides a comprehensive overview of the project, its architecture, and how to build, deploy, and interact with it.

## Project Vision

This project aims to build a decentralized and transparent microfinance platform on the Linea network, inspired by the Grameen Bank's model of joint-liability group lending. By leveraging blockchain technology, we can reduce administrative overhead, increase transparency, and provide access to financial services for underserved communities.

## Core Concepts

*   **Joint-Liability Groups**: Users form small groups (3-12 members) and pool their resources. The group as a whole is responsible for the loans of its members.
*   **Savings First**: Before they can borrow, users must demonstrate a consistent savings history, building financial discipline and a capital base.
*   **Attestation & KYC**: To ensure compliance and prevent fraud, users must be attested by a whitelisted issuer. This provides a basic level of Know Your Customer (KYC).
*   **Group-Approved Loans**: Loan applications are approved by the user's group, creating social collateral and encouraging responsible borrowing.
*   **Stake & Slashing**: Groups lock a portion of their savings as a stake. In case of a default, a portion of this stake is "slashed" (forfeited), creating a strong incentive for the group to ensure all members repay their loans.

## System Architecture

The Linea Microfinance platform is a monorepo containing several key components:

*   **Smart Contracts**: The core logic of the platform, written in Solidity and built with Foundry.
*   **Subgraph**: An indexing layer from The Graph that provides a fast and efficient way to query on-chain data.
*   **Frontend**: A Next.js web application that provides a user-friendly interface for interacting with the platform.
*   **Deployment Scripts**: Foundry scripts for deploying and configuring the smart contracts.

![System Architecture Diagram](https://i.imgur.com/your-architecture-diagram.png) 
**(Note: This is a placeholder for a diagram that should be created)**

## Documentation Index

1.  **[Getting Started](./01_getting_started.md)**: A guide for developers on how to set up the project, run tests, and deploy the application.
2.  **[Smart Contracts](./02_smart_contracts.md)**: A detailed look at the on-chain components of the platform.
3.  **[Frontend Application](./03_frontend_app.md)**: An overview of the web application and its features.
4.  **[Subgraph (Data Indexing)](./04_subgraph.md)**: Information on the data indexing and query layer.
5.  **[Deployment Runbook](./05_deployment_runbook.md)**: A guide for deploying and managing the application.
6.  **[Governance and Security](./06_governance_and_security.md)**: An explanation of the governance model and security considerations.

