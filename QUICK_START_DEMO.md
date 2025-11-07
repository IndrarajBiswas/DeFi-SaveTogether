# 🚀 Quick Start: Make This Work for Your Hackathon Demo

## ⚡ 30-Minute Critical Path

Follow this to get a **working demo** ASAP:

---

## Step 1: Verify Your Setup (5 min)

```bash
# Check you have everything
cd /home/user/DeFi-SaveTogether

# Verify contracts exist
ls contracts/*.sol

# Check if already deployed
cat .env.example | grep "0x"

# Check frontend builds
cd app && npm run build
```

✅ **You have:** All contracts + deployment addresses + working build

---

## Step 2: Get Contract ABIs (10 min)

You need the ABIs to call contracts from the frontend.

### Option A: Quick Manual ABIs (Recommended for speed)

Create `app/lib/abis/` directory and copy minimal ABIs:

```bash
mkdir -p app/lib/abis
```

I'll create these for you:

**SavingsPool ABI** - `app/lib/abis/SavingsPool.json`:
```json
[
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function balanceOf(address user) view returns (uint256)",
  "function streak(address user) view returns (uint40)",
  "function consecutiveWeeks(address user) view returns (uint40)",
  "event Deposited(address indexed user, uint256 amount, uint40 week)"
]
```

**LabUSDT ABI** - `app/lib/abis/ERC20.json`:
```json
[
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)"
]
```

### Option B: Compile and Extract (Better, but slower)

```bash
# Install Foundry if not installed
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile contracts
forge build

# ABIs are now in out/[Contract].sol/[Contract].json
# Extract the "abi" field from each JSON
```

---

## Step 3: Connect ONE Page (15 min)

Let's start with the **Savings Page** since it's simplest.

### Update `app/pages/savings.tsx`:

Replace the entire file with this working version:

```typescript
import { FormEvent, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, parseLabUSDT, formatLabUSDT } from '../lib/contracts'

export default function SavingsPage() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState(100)
  const [withdrawAmount, setWithdrawAmount] = useState(0)

  // Read user's savings balance
  const { data: balance } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read user's streak
  const { data: streak } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'streak',
    args: address ? [address] : undefined,
  })

  // Read LabUSDT balance
  const { data: usdtBalance } = useReadContract({
    ...CONTRACTS.labUSDT,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read approval
  const { data: allowance } = useReadContract({
    ...CONTRACTS.labUSDT,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.savingsPool.address] : undefined,
  })

  // Write functions
  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: deposit, data: depositHash } = useWriteContract()
  const { writeContract: withdraw, data: withdrawHash } = useWriteContract()

  // Wait for transactions
  const { isLoading: isApproving } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isLoading: isDepositing } = useWaitForTransactionReceipt({ hash: depositHash })
  const { isLoading: isWithdrawing } = useWaitForTransactionReceipt({ hash: withdrawHash })

  const handleApprove = () => {
    approve({
      ...CONTRACTS.labUSDT,
      functionName: 'approve',
      args: [CONTRACTS.savingsPool.address, parseLabUSDT(10000)], // Approve 10k
    })
  }

  const handleDeposit = (evt: FormEvent) => {
    evt.preventDefault()
    if (!isConnected) {
      alert('Please connect wallet first')
      return
    }
    deposit({
      ...CONTRACTS.savingsPool,
      functionName: 'deposit',
      args: [parseLabUSDT(depositAmount)],
    })
  }

  const handleWithdraw = (evt: FormEvent) => {
    evt.preventDefault()
    withdraw({
      ...CONTRACTS.savingsPool,
      functionName: 'withdraw',
      args: [parseLabUSDT(withdrawAmount)],
    })
  }

  const needsApproval = !allowance || allowance < parseLabUSDT(depositAmount)

  return (
    <div className="grid">
      <section className="card">
        <h1>Savings Pool</h1>
        {isConnected ? (
          <>
            <p>Your LabUSDT: {usdtBalance ? formatLabUSDT(usdtBalance) : '0.00'}</p>
            <p>Savings Balance: {balance ? formatLabUSDT(balance) : '0.00'}</p>
            <p>Current Streak: {streak?.toString() || '0'} weeks</p>
          </>
        ) : (
          <p>Connect your wallet to view your savings</p>
        )}
      </section>

      <section className="card">
        <h2>Deposit</h2>
        {needsApproval && isConnected && (
          <button onClick={handleApprove} disabled={isApproving}>
            {isApproving ? 'Approving...' : 'Approve LabUSDT'}
          </button>
        )}
        <form className="form" onSubmit={handleDeposit}>
          <label>
            Amount (LabUSDT)
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
            />
          </label>
          <button type="submit" disabled={!isConnected || needsApproval || isDepositing}>
            {isDepositing ? 'Depositing...' : 'Deposit'}
          </button>
        </form>
        {depositHash && (
          <p>
            Transaction:{' '}
            <a
              href={`https://explorer.didlab.org/tx/${depositHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Explorer
            </a>
          </p>
        )}
      </section>

      <section className="card">
        <h2>Withdraw</h2>
        <form className="form" onSubmit={handleWithdraw}>
          <label>
            Amount (LabUSDT)
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            />
          </label>
          <button type="submit" disabled={!isConnected || isWithdrawing}>
            {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
          </button>
        </form>
      </section>
    </div>
  )
}
```

**Key Changes:**
- ✅ Real wallet connection check
- ✅ Reads actual balances from contracts
- ✅ Real approve/deposit/withdraw transactions
- ✅ Loading states
- ✅ Transaction links to explorer

---

## Step 4: Test It! (10 min)

```bash
# Start dev server
cd app
npm run dev
```

Visit http://localhost:3000/savings

**Test Flow:**
1. Connect MetaMask to DIDLab network
2. You should see your LabUSDT balance
3. Click "Approve LabUSDT"
4. Wait for approval confirmation
5. Enter deposit amount (e.g., 10)
6. Click "Deposit"
7. Check transaction on explorer
8. See updated balance

---

## 🎯 DEMO SCRIPT FOR JUDGES

### Preparation (Before Demo):
1. Have 2-3 test wallets ready
2. Each wallet should have:
   - TT tokens for gas (get from https://faucet.didlab.org)
   - LabUSDT tokens (request from deployer or mint if you control it)
3. Pre-create one test group
4. Have one active loan to show

### Live Demo Flow (5 minutes):

**Slide 1: Problem**
"In developing countries, 1.7 billion adults lack access to credit. Traditional banks won't serve them."

**Slide 2: Solution**
"We built SaveTogether - group-based microfinance on blockchain. No banks needed."

**Slide 3: Live Demo**

**[Screen: Homepage]**
- Show live stats (TVL, active loans, groups)

**[Screen: Savings]**
- "First, users build credit by saving weekly"
- Connect wallet
- Deposit 50 LabUSDT
- Show streak counter

**[Screen: Groups]**
- "Users form trust groups of 5-8 people"
- Show existing group
- Explain 3-of-5 approval mechanism

**[Screen: Loans]**
- "Once qualified, request a loan"
- Request 100 LabUSDT for 8 weeks
- Show 2% interest calculation
- Explain group approval flow

**[Screen: Admin]**
- "Platform governed by DAO"
- Show parameter adjustment
- Show pause mechanism for emergencies

**Slide 4: Tech Stack**
- Solidity smart contracts
- Next.js + wagmi
- Deployed on DIDLab
- Open source

**Slide 5: Impact**
- Financial inclusion for unbanked
- No credit scores needed
- Community-based trust
- Transparent on-chain

---

## 🚨 TROUBLESHOOTING

### "Transaction failing"
- Check you have TT for gas
- Check you approved enough LabUSDT
- Check contract isn't paused

### "Can't read contract"
- Verify addresses in .env match deployment
- Check RPC URL is correct
- Try refreshing page

### "Wallet not connecting"
- Make sure MetaMask has DIDLab network added:
  - Chain ID: 252501
  - RPC: https://eth.didlab.org
  - Symbol: TT
  - Explorer: https://explorer.didlab.org

### "No LabUSDT tokens"
- Ask deployer to transfer some
- Or if you deployed, check if token is mintable
- Verify token address is correct

---

## 📝 TODO BEFORE SUBMISSION

- [ ] All 5 pages work with real transactions
- [ ] README has live demo link
- [ ] Video demo uploaded to YouTube
- [ ] Contract addresses documented
- [ ] GitHub repo is public
- [ ] Code is commented
- [ ] Tests pass (`forge test`)
- [ ] Frontend builds without errors
- [ ] Mobile responsive (optional)
- [ ] Deployed to Vercel/Netlify

---

## 🏆 WINNING TIPS

1. **Focus on UX:** Make it dead simple to use
2. **Show real impact:** Use real use case examples
3. **Leverage DIDLab features:** Use badges, SIWE, IPFS
4. **Polish the demo:** Practice until smooth
5. **Document well:** Judges appreciate good docs
6. **Test thoroughly:** Don't demo broken features
7. **Tell a story:** Why does this matter?
8. **Know your numbers:** TVL, users, transactions

---

## ⏱️ TIME ALLOCATION

If you have **6 hours total:**
- Contract integration: 3 hours
- Testing: 1 hour
- Demo prep: 1 hour
- Documentation: 1 hour

If you have **12 hours total:**
- Contract integration: 4 hours
- Additional features (badges/stats): 3 hours
- Testing: 2 hours
- Polish & documentation: 3 hours

**Remember:** A simple working demo beats a complex broken one!

---

## 📞 FINAL CHECKLIST

Before you submit:

**Technical:**
- [ ] Frontend connects to wallet
- [ ] Can read contract data
- [ ] Can execute transactions
- [ ] Transactions confirm on-chain
- [ ] Error handling works
- [ ] Loading states show

**Documentation:**
- [ ] README is clear
- [ ] Architecture diagram exists
- [ ] Contract addresses listed
- [ ] How to run locally documented
- [ ] Demo video recorded

**Presentation:**
- [ ] Pitch deck ready (5 slides)
- [ ] Live demo practiced
- [ ] Backup plan if internet fails
- [ ] Questions anticipated

**DIDLab Specific:**
- [ ] Deployed on chain 252501
- [ ] Used DIDLab RPC
- [ ] Transactions visible on explorer
- [ ] LMS submission completed

---

Good luck! 🚀

**Remember:** Judges want to see:
1. It works (most important!)
2. It solves a real problem
3. You understand the tech
4. It's polished enough to be credible

You have a great foundation - just need to connect the pieces!
