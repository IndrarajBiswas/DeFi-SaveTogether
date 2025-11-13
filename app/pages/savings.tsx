import { FormEvent, useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { CONTRACTS, parseLabUSDT, formatLabUSDT } from '../lib/contracts'
import { Container, PageHeader, SectionCard, StatCard, Button, Badge, Input, Card } from '../components/ui'
import { Wallet, TrendingUp, Zap, Calendar, AlertCircle, CheckCircle2, Info, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import HelpDialog from '../components/HelpDialog'
import { useToast } from '../components/Toast'

export default function SavingsPage() {
  const { address, isConnected } = useAccount()
  const [depositAmount, setDepositAmount] = useState('100')
  const [withdrawAmount, setWithdrawAmount] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [showSavingsHelp, setShowSavingsHelp] = useState(false)
  const toast = useToast()

  // Read user's LabUSDT balance
  const { data: usdtBalance } = useBalance({
    address: address,
    token: CONTRACTS.labUSDT.address,
  })

  // Read user's savings balance
  const { data: savingsBalance, refetch: refetchSavingsBalance } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  // Read user's streak
  const { data: streak, refetch: refetchStreak } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'streak',
    args: address ? [address] : undefined,
  })

  // Read consecutive weeks
  const { data: consecutiveWeeks } = useReadContract({
    ...CONTRACTS.savingsPool,
    functionName: 'consecutiveWeeks',
    args: address ? [address] : undefined,
  })

  // Read allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...CONTRACTS.labUSDT,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.savingsPool.address] : undefined,
  })

  // Write functions
  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: deposit, data: depositHash } = useWriteContract()
  const { writeContract: withdraw, data: withdrawHash } = useWriteContract()

  // Wait for transactions
  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isLoading: isDepositing, isSuccess: depositSuccess } = useWaitForTransactionReceipt({ hash: depositHash })
  const { isLoading: isWithdrawing, isSuccess: withdrawSuccess } = useWaitForTransactionReceipt({ hash: withdrawHash })

  // Handle transaction successes with toast notifications
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance()
      toast.success('Approval Successful', 'You can now deposit LabUSDT to your savings.')
    }
  }, [approveSuccess, refetchAllowance, toast])

  useEffect(() => {
    if (depositSuccess) {
      refetchSavingsBalance()
      refetchStreak()
      toast.success('Deposit Successful', 'Your savings streak has been updated!')
      setDepositAmount('100')
    }
  }, [depositSuccess, refetchSavingsBalance, refetchStreak, toast])

  useEffect(() => {
    if (withdrawSuccess) {
      refetchSavingsBalance()
      toast.warning('Withdrawal Successful', 'Your savings streak has been reset to zero.')
      setWithdrawAmount('0')
    }
  }, [withdrawSuccess, refetchSavingsBalance, toast])

  const handleApprove = () => {
    setError(null)
    approve({
      ...CONTRACTS.labUSDT,
      functionName: 'approve',
      args: [CONTRACTS.savingsPool.address, parseLabUSDT(10000)],
    })
  }

  const handleDeposit = (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    const amount = parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid deposit amount')
      return
    }

    deposit({
      ...CONTRACTS.savingsPool,
      functionName: 'deposit',
      args: [parseLabUSDT(amount)],
    })
  }

  const handleWithdraw = (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)

    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid withdrawal amount')
      return
    }

    if (savingsBalance && parseLabUSDT(amount) > (savingsBalance as bigint)) {
      setError('Insufficient savings balance')
      return
    }

    withdraw({
      ...CONTRACTS.savingsPool,
      functionName: 'withdraw',
      args: [parseLabUSDT(amount)],
    })
  }

  const needsApproval = !allowance || (allowance as bigint) < parseLabUSDT(parseFloat(depositAmount) || 0)
  const currentStreak = Number(streak || 0)
  const isLoanEligible = currentStreak >= 5

  return (
    <Container>
      <PageHeader
        title="Savings"
        subtitle="Build your savings streak to unlock loan eligibility"
        action={
          <Button variant="ghost" onClick={() => setShowSavingsHelp(true)} icon={Info}>
            How It Works
          </Button>
        }
      />

      {/* User Stats */}
      {isConnected ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={usdtBalance ? Number(usdtBalance.formatted).toFixed(2) : '0.00'}
            label="Wallet Balance"
            icon={Wallet}
          />
          <StatCard
            value={savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'}
            label="Savings Balance"
            icon={TrendingUp}
          />
          <StatCard
            value={currentStreak.toString()}
            label="Current Streak"
            icon={Zap}
          />
          <StatCard
            value={consecutiveWeeks?.toString() || '0'}
            label="Consecutive Weeks"
            icon={Calendar}
          />
        </div>
      ) : (
        <Card className="mb-8 text-center py-12">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-text-muted" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">Connect Your Wallet</h3>
          <p className="text-text-secondary">Please connect your wallet to view your savings and make deposits</p>
        </Card>
      )}

      {/* Streak Progress */}
      {isConnected && (
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Loan Eligibility Progress</h3>
            <Badge variant={isLoanEligible ? 'success' : 'default'}>
              {currentStreak}/5 weeks
            </Badge>
          </div>

          <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden border border-border-subtle">
            <div
              className={`h-full transition-all duration-500 ${
                isLoanEligible ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-accent to-accent-soft'
              }`}
              style={{ width: `${Math.min((currentStreak / 5) * 100, 100)}%` }}
            />
          </div>

          {isLoanEligible ? (
            <div className="mt-4 flex items-start gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-400 mb-1">Loan Eligible!</p>
                <p className="text-sm text-text-secondary">
                  You have {currentStreak} weeks of savings streak. You can now request loans.
                </p>
              </div>
            </div>
          ) : currentStreak > 0 ? (
            <div className="mt-4 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-400 mb-1">Keep Going!</p>
                <p className="text-sm text-text-secondary">
                  You need {5 - currentStreak} more weeks of consecutive savings to unlock loan eligibility.
                </p>
              </div>
            </div>
          ) : null}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit Section */}
        <SectionCard
          title="Deposit Savings"
          subtitle="Build your weekly streak"
        >
          {error && (
            <div className="mb-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {needsApproval && isConnected && (
            <div className="mb-6 p-4 bg-card-hover rounded-lg border border-border-subtle">
              <p className="text-sm text-text-secondary mb-3">
                First, approve the SavingsPool contract to spend your LabUSDT
              </p>
              <Button
                onClick={handleApprove}
                loading={isApproving}
                disabled={isApproving}
                variant="secondary"
                className="w-full"
              >
                Approve LabUSDT
              </Button>
            </div>
          )}

          <form onSubmit={handleDeposit} className="space-y-4">
            <Input
              label="Amount (LabUSDT)"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="100"
              min="0"
              step="0.01"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!isConnected || needsApproval || isDepositing}
              loading={isDepositing}
              icon={ArrowDownCircle}
              className="w-full"
            >
              Deposit to Savings
            </Button>
          </form>

          {depositHash && (
            <a
              href={`https://explorer.didlab.org/tx/${depositHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-sm text-accent hover:text-accent-hover underline"
            >
              View Transaction →
            </a>
          )}
        </SectionCard>

        {/* Withdraw Section */}
        <SectionCard
          title="Withdraw Savings"
          subtitle="Warning: Resets your streak"
        >
          <div className="mb-6 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-400 mb-1">Warning</p>
              <p className="text-sm text-text-secondary">
                Withdrawing will reset your savings streak to zero!
              </p>
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <Input
              label="Amount (LabUSDT)"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              hint={`Available: ${savingsBalance ? formatLabUSDT(savingsBalance as bigint) : '0.00'} LabUSDT`}
            />
            <Button
              type="submit"
              variant="outline"
              disabled={!isConnected || isWithdrawing || !savingsBalance || savingsBalance === BigInt(0)}
              loading={isWithdrawing}
              icon={ArrowUpCircle}
              className="w-full"
            >
              Withdraw Savings
            </Button>
          </form>

          {withdrawHash && (
            <a
              href={`https://explorer.didlab.org/tx/${withdrawHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-sm text-accent hover:text-accent-hover underline"
            >
              View Transaction →
            </a>
          )}
        </SectionCard>
      </div>

      {/* FAQ */}
      <SectionCard title="Frequently Asked Questions" className="mt-8">
        <div className="space-y-6">
          {[
            {
              q: 'What is a savings streak?',
              a: 'Your savings streak is the number of consecutive weeks you\'ve made deposits. It demonstrates financial discipline and is required to access loans.',
            },
            {
              q: 'Why do I need 5 weeks?',
              a: 'The 5-week minimum streak requirement shows consistent savings behavior and reduces default risk. It\'s based on proven microfinance principles.',
            },
            {
              q: 'Can I deposit multiple times per week?',
              a: 'Yes! Multiple deposits in the same week count as one week for your streak. Your total balance increases with each deposit.',
            },
            {
              q: 'What happens if I miss a week?',
              a: 'If you skip a week, your streak resets to 1 when you make your next deposit. You\'ll need to build back up to 5 consecutive weeks.',
            },
          ].map((faq, idx) => (
            <div key={idx}>
              <h3 className="text-base font-semibold text-text-primary mb-2">{faq.q}</h3>
              <p className="text-sm text-text-secondary">{faq.a}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Help Dialog */}
      <HelpDialog
        isOpen={showSavingsHelp}
        onClose={() => setShowSavingsHelp(false)}
        title="How Savings Work"
        icon="💰"
      >
        <div>
          <h3>Deposit Weekly</h3>
          <p>
            Make deposits every week to build your savings streak. The amount can vary, but consistency
            is key. Each deposit within a 7-day period counts toward your streak.
          </p>

          <h3>Build Reputation</h3>
          <p>
            A 5-week consecutive streak unlocks loan eligibility. This demonstrates financial discipline
            and reduces default risk. Your streak is your reputation in the SaveTogether ecosystem.
          </p>

          <h3>Maintain Streak</h3>
          <p>
            Missing a week resets your streak back to zero. If you skip a week, you&apos;ll need to start over
            and build back up to 5 consecutive weeks. Plan ahead to maintain your streak.
          </p>

          <h3>Withdrawing Resets</h3>
          <p>
            Any withdrawal will reset your streak counter to zero. This is an important safeguard in the
            system. Only withdraw when absolutely necessary, as you&apos;ll lose your loan eligibility until you
            rebuild your streak.
          </p>
        </div>
      </HelpDialog>
    </Container>
  )
}
