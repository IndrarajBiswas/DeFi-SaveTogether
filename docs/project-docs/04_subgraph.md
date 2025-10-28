# Subgraph (Data Indexing)

This document explains the role of the subgraph in the Linea Microfinance platform and how it is used to index and query on-chain data.

## What is a Subgraph?

A subgraph is a custom API built on top of the Ethereum blockchain, powered by The Graph. It allows for efficient querying of on-chain data without having to interact directly with the smart contracts. This is particularly useful for building user interfaces that require complex data filtering, sorting, and pagination.

## The Linea Microfinance Subgraph

The subgraph for this project is located in the `subgraph/` directory. It is designed to track all the key events and entities within the platform, providing a rich and queryable dataset.

### `subgraph.yaml`

This is the main configuration file for the subgraph. It defines:

*   The smart contracts to index.
*   The events to listen for.
*   The mapping functions that transform the event data into entities.

### `schema.graphql`

This file defines the data schema for the subgraph. It specifies the entities that will be stored and the relationships between them. The key entities in the Linea Microfinance subgraph are:

*   **`User`**: Represents a user of the platform.
*   **`Group`**: Represents a user group.
*   **`Loan`**: Represents a loan taken out by a user.
*   **`SavingsDeposit`**: Represents a savings deposit made by a user.
*   **`Repayment`**: Represents a repayment made by a user.

### `src/mapping.ts`

This file contains the mapping handlers. These are TypeScript functions that are executed whenever a new event is emitted by the smart contracts. The mapping handlers are responsible for:

*   Receiving the event data.
*   Creating or updating the corresponding entities in the subgraph.
*   Saving the entities to the Graph Node.

## Building and Deploying the Subgraph

To build and deploy the subgraph, you will need to have the Graph CLI installed:

```bash
npm install -g @graphprotocol/graph-cli
```

### 1. Code Generation

Before you can build the subgraph, you need to generate the necessary code from the GraphQL schema:

```bash
graph codegen
```

### 2. Build the Subgraph

To build the subgraph, run the following command:

```bash
graph build
```

This will compile the mapping handlers and prepare the subgraph for deployment.

### 3. Deploy to The Graph

To deploy the subgraph, you will need to have an account on The Graph's hosted service. Once you have created a new subgraph on their platform, you can deploy it with the following command:

```bash
graph deploy --product hosted-service <your-subgraph-slug>
```

## Querying the Subgraph

Once the subgraph is deployed, you can query it using GraphQL. The Graph's hosted service provides a GraphQL playground where you can test your queries. The frontend application can then use a GraphQL client, like Apollo Client or `urql`, to fetch data from the subgraph and display it in the user interface.

---

Next, read the **[Deployment Runbook](./05_deployment_runbook.md)** for instructions on how to deploy and manage the application.
