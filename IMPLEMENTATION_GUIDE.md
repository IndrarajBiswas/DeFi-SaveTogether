# SaveTogether - Implementation Guide

## 🚀 Quick Start

This guide shows you how to apply the new design system to activate the redesigned SaveTogether platform.

---

## Step 1: Activate the New Files

### 1.1 Replace the Layout Component

```bash
cd /home/user/DeFi-SaveTogether/app/components
mv Layout.tsx Layout-old-backup.tsx
mv LayoutNew.tsx Layout.tsx
```

### 1.2 Replace the Dashboard Page

```bash
cd /home/user/DeFi-SaveTogether/app/pages
mv index.tsx index-old-backup.tsx
mv index-new.tsx index.tsx
```

### 1.3 Update _app.tsx to Use Dark Mode

Update `/app/pages/_app.tsx` to add the `dark` class to the HTML element:

```tsx
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../lib/wagmi'
import Layout from '../components/Layout'
import { ToastProvider } from '../components/Toast'
import '../styles/globals.css'
import { useEffect } from 'react'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ToastProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

---

## Step 2: Apply Design System to Other Pages

### Example: Savings Page Pattern

Here's how to refactor any existing page to use the new design system:

**BEFORE** (old pattern with inline styles):
```tsx
export default function Savings() {
  return (
    <div className="grid">
      <section className="card">
        <h2>My Savings</h2>
        <p style={{ color: 'var(--gray-700)' }}>View your savings</p>
      </section>
    </div>
  )
}
```

**AFTER** (new pattern with Tailwind + components):
```tsx
import { Container, PageHeader, SectionCard, StatCard, Button } from '../components/ui'
import { Wallet, TrendingUp, Calendar } from 'lucide-react'

export default function Savings() {
  return (
    <Container>
      <PageHeader
        title="Savings"
        subtitle="Manage your deposits and track your progress"
        action={<Button variant="primary" icon={Wallet}>Deposit</Button>}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          value="150.00"
          label="Total Saved"
          icon={Wallet}
        />
        <StatCard
          value="5"
          label="Week Streak"
          icon={TrendingUp}
        />
        <StatCard
          value="Mar 15"
          label="Next Deposit"
          icon={Calendar}
        />
      </div>

      {/* Main Content */}
      <SectionCard title="Savings History">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Streak</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mar 8, 2024</td>
                <td className="font-mono">30.00 LabUSDT</td>
                <td><Badge variant="success">5 weeks</Badge></td>
              </tr>
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Container>
  )
}
```

### Key Patterns for All Pages:

1. **Always use Container**
   ```tsx
   <Container> // Provides max-width and padding
     {/* page content */}
   </Container>
   ```

2. **Start with PageHeader**
   ```tsx
   <PageHeader
     title="Page Name"
     subtitle="Optional description"
     action={<Button>Primary Action</Button>}
   />
   ```

3. **Use StatCards for metrics**
   ```tsx
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     <StatCard value="123" label="Metric 1" icon={Icon1} />
     <StatCard value="456" label="Metric 2" icon={Icon2} />
   </div>
   ```

4. **Use SectionCard for content blocks**
   ```tsx
   <SectionCard title="Section Title" subtitle="Optional subtitle">
     {/* content */}
   </SectionCard>
   ```

5. **Use consistent text colors**
   - Headings: `text-text-primary` (automatic with components)
   - Body: `text-text-secondary`
   - Captions/hints: `text-text-muted`
   - **NEVER** use `text-gray-700` or `color: var(--gray-700)` in dark mode!

---

## Step 3: Page-Specific Templates

### Savings Page Template

```tsx
import { useAccount, useReadContract } from 'wagmi'
import { Container, PageHeader, SectionCard, StatCard, Button, Badge, EmptyState } from '../components/ui'
import { Wallet, TrendingUp, Calendar, Plus } from 'lucide-react'
import { CONTRACTS, formatLabUSDT } from '../lib/contracts'

export default function Savings() {
  const { address } = useAccount()

  const { data: balance } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const { data: streak } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'streak',
    args: address ? [address] : undefined,
  })

  return (
    <Container>
      <PageHeader
        title="Savings"
        subtitle="Build your financial reputation through consistent deposits"
        action={
          <Button variant="primary" icon={Plus}>
            New Deposit
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          value={balance ? formatLabUSDT(balance as bigint) : '0.00'}
          label="Total Savings"
          icon={Wallet}
        />
        <StatCard
          value={streak?.toString() || '0'}
          label="Current Streak"
          icon={TrendingUp}
        />
        <StatCard
          value="5 weeks"
          label="Goal"
          icon={Calendar}
        />
      </div>

      <SectionCard title="Recent Deposits">
        {/* Add your table or list here */}
        <EmptyState
          icon="💰"
          title="No deposits yet"
          message="Make your first deposit to start building your savings streak"
          action={{
            label: "Make Deposit",
            onClick: () => {},
            icon: Plus
          }}
        />
      </SectionCard>
    </Container>
  )
}
```

### Groups Page Template

```tsx
import { Container, PageHeader, SectionCard, Card, Button, Badge, EmptyState } from '../components/ui'
import { Users, Plus, Shield } from 'lucide-react'

export default function Groups() {
  const groups = [] // Replace with actual data

  return (
    <Container>
      <PageHeader
        title="Groups"
        subtitle="Join or create lending circles for mutual support"
        action={
          <Button variant="primary" icon={Plus}>
            Create Group
          </Button>
        }
      />

      {groups.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No groups yet"
          message="Create or join a lending group to access loans and build community trust"
          action={{
            label: "Create Group",
            onClick: () => {},
            icon: Plus
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group: any) => (
            <Card key={group.id} interactive>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-1">
                    {group.name}
                  </h3>
                  <Badge variant="success" dot>Active</Badge>
                </div>
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Members</span>
                  <span className="font-semibold text-text-primary">{group.members}/8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Stake</span>
                  <span className="font-mono font-semibold text-text-primary">{group.stake} LabUSDT</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  )
}
```

### Loans Page Template

```tsx
import { Container, PageHeader, SectionCard, StatCard, Button, Badge, Card } from '../components/ui'
import { Landmark, Clock, DollarSign, TrendingDown } from 'lucide-react'

export default function Loans() {
  return (
    <Container>
      <PageHeader
        title="Loans"
        subtitle="Access microfinance with group approval and fair rates"
        action={
          <Button variant="primary" icon={Landmark}>
            Request Loan
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          value="0.00"
          label="Active Loan"
          icon={DollarSign}
        />
        <StatCard
          value="2%"
          label="Interest Rate"
          icon={TrendingDown}
        />
        <StatCard
          value="0"
          label="Payments Due"
          icon={Clock}
        />
        <StatCard
          value="250"
          label="Max Available"
          icon={Landmark}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionCard title="Current Loan">
          <p className="text-text-secondary">No active loans</p>
        </SectionCard>

        <SectionCard title="Loan Requirements">
          <div className="space-y-3">
            {[
              { label: 'Attestation Level', value: '≥ 1', met: true },
              { label: 'Savings Streak', value: '≥ 5 weeks', met: false },
              { label: 'Group Membership', value: 'Active', met: false },
            ].map((req) => (
              <div key={req.label} className="flex items-center justify-between py-2">
                <span className="text-text-secondary">{req.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text-primary">{req.value}</span>
                  <Badge variant={req.met ? 'success' : 'warning'}>
                    {req.met ? '✓' : '✗'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </Container>
  )
}
```

---

## Step 4: Common Patterns Reference

### Pattern 1: Data Loading States

```tsx
// Show skeleton while loading
{loading ? (
  <div className="space-y-4">
    <div className="skeleton-card" />
    <div className="skeleton-card" />
  </div>
) : (
  <ActualContent />
)}
```

### Pattern 2: Empty States

```tsx
{items.length === 0 ? (
  <EmptyState
    icon={IconComponent}
    title="No items yet"
    message="Get started by creating your first item"
    action={{
      label: "Create Item",
      onClick: handleCreate,
      icon: Plus
    }}
  />
) : (
  <ItemsList items={items} />
)}
```

### Pattern 3: Status Badges

```tsx
<Badge variant="success" dot>Active</Badge>
<Badge variant="warning" dot>Pending</Badge>
<Badge variant="error" dot>Failed</Badge>
<Badge variant="info" dot>Processing</Badge>
```

### Pattern 4: Responsive Grids

```tsx
{/* 1 column mobile, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</div>
```

### Pattern 5: Tables

```tsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {data.map(row => (
        <tr key={row.id}>
          <td>{row.col1}</td>
          <td>{row.col2}</td>
          <td className="font-mono">{row.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

---

## Step 5: Color Usage Guide

### ✅ DO: Use Semantic Tokens

```tsx
<p className="text-text-primary">Main heading</p>
<p className="text-text-secondary">Supporting text</p>
<p className="text-text-muted">Captions and hints</p>
<button className="bg-accent hover:bg-accent-hover">CTA</button>
```

### ❌ DON'T: Use Raw Color Values

```tsx
// NEVER do this in dark mode:
<p style={{ color: 'var(--gray-700)' }}>Bad</p>
<p className="text-gray-700">Also bad</p>
<p style={{ color: '#404040' }}>Very bad</p>
```

---

## Step 6: Testing Checklist

Before deploying your changes:

- [ ] All text is visible (no black on black)
- [ ] Buttons have proper hover states
- [ ] Links change color on hover
- [ ] Focus states are visible (tab through page)
- [ ] Mobile menu works (< 768px width)
- [ ] Tables are scrollable on mobile
- [ ] Empty states show when no data
- [ ] Loading skeletons prevent layout shift
- [ ] Icons are properly sized (usually w-4 h-4 or w-5 h-5)
- [ ] Spacing is consistent across pages

---

## Step 7: Build and Deploy

```bash
# Navigate to app directory
cd /home/user/DeFi-SaveTogether/app

# Install dependencies (if not already done)
npm install

# Build the application
npm run build

# Run in development
npm run dev

# Visit http://localhost:3000
```

---

## 🎯 Quick Reference

### Common Component Imports

```tsx
import {
  Container,
  PageHeader,
  Card,
  HeroCard,
  StatCard,
  SectionCard,
  MetricRow,
  Button,
  Badge,
  EmptyState,
  Input,
  Select
} from '../components/ui'

import {
  Wallet,
  Users,
  Landmark,
  Shield,
  // ... etc
} from 'lucide-react'
```

### Color Classes Quick Reference

| Purpose | Class |
|---------|-------|
| Page background | `bg-page-bg` |
| Card background | `bg-card-bg` |
| Hover state | `bg-card-hover` |
| Primary text | `text-text-primary` |
| Secondary text | `text-text-secondary` |
| Muted text | `text-text-muted` |
| Accent (teal) | `text-accent` / `bg-accent` |
| Border | `border-border-subtle` |

---

## 📚 Additional Resources

- **Design System Documentation**: `/DESIGN_SYSTEM.md`
- **Tailwind Config**: `/app/tailwind.config.js`
- **Global Styles**: `/app/styles/globals.css`
- **UI Components**: `/app/components/ui/`

---

**Need Help?** All components are documented in `/DESIGN_SYSTEM.md` with code examples!
