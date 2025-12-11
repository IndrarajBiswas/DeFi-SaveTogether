# W7 Vertical Slice Diagram

```mermaid
graph TD
    A[Next.js CLI / wagmi] -->|deposit()| B[SavingsPool]
    B -->|emit DepositEvent| C[Event Log]
    C -->|subscribe| D[Client Listener]
    B -->|streak()| E[State Readback]
    D -->|renders| F[Dashboard Streak Card]
```

*Flow:* Single command from CLI triggers on-chain deposit, emits `DepositEvent`, and client subscribes to render the updated streak count. Readback verifies state change on-chain.
