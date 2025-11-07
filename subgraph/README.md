# SaveTogether Subgraph

GraphQL API for querying SaveTogether platform data.

## Setup

1. Install dependencies:
```bash
npm install -g @graphprotocol/graph-cli
```

2. Generate code:
```bash
graph codegen
```

3. Build:
```bash
graph build
```

4. Deploy:
```bash
graph deploy --product hosted-service username/savetogether
```

## Entities

- **User**: User accounts with savings, loans, and badges
- **Loan**: Individual loan records
- **Repayment**: Loan repayment transactions
- **Group**: Savings groups
- **Badge**: Achievement badges awarded
- **Deposit/Withdrawal**: Savings transactions
- **PlatformStats**: Aggregate platform statistics
- **DailyStat**: Daily metrics

## Example Queries

See `schema.graphql` for full schema definition.
