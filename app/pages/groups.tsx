import { FormEvent, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, parseLabUSDT } from '../lib/contracts'
import { isValidEthAddress } from '../lib/validation'
import { Container, PageHeader, SectionCard, StatCard, Button, Input, EmptyState } from '../components/ui'
import { Users, Plus, Shield, AlertCircle } from 'lucide-react'
import HelpDialog from '../components/HelpDialog'

export default function GroupsPage() {
  const { address, isConnected } = useAccount()
  const [members, setMembers] = useState(['', '', '', '', ''])
  const [minApprovals, setMinApprovals] = useState(3)
  const [stakeAmount, setStakeAmount] = useState('100')
  const [groupId, setGroupId] = useState('0')
  const [error, setError] = useState<string | null>(null)
  const [showGroupsHelp, setShowGroupsHelp] = useState(false)

  const { data: groupCount } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'groupCount',
  })

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    ...CONTRACTS.labUSDT,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.groupVault.address] : undefined,
  })

  const { writeContract: approve, data: approveHash } = useWriteContract()
  const { writeContract: createGroup, data: createGroupHash } = useWriteContract()
  const { writeContract: lockStake, data: lockStakeHash } = useWriteContract()

  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({ hash: approveHash })
  const { isLoading: isCreatingGroup, isSuccess: createGroupSuccess } = useWaitForTransactionReceipt({ hash: createGroupHash })
  const { isLoading: isLockingStake, isSuccess: lockStakeSuccess } = useWaitForTransactionReceipt({ hash: lockStakeHash })

  if (approveSuccess) refetchAllowance()

  const handleChangeMember = (index: number, value: string) => {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
    if (error) setError(null)
  }

  const handleCreateGroup = (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)

    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    const validMembers = members.filter((addr) => addr && addr !== '' && addr !== '0x')

    if (validMembers.length < 5) {
      setError('At least 5 members are required')
      return
    }

    for (const addr of validMembers) {
      if (!isValidEthAddress(addr)) {
        setError(`Invalid Ethereum address: ${addr}`)
        return
      }
    }

    if (minApprovals < 3 || minApprovals > validMembers.length) {
      setError(`Min approvals must be between 3 and ${validMembers.length}`)
      return
    }

    createGroup({
      ...CONTRACTS.groupVault,
      functionName: 'createGroup',
      args: [validMembers as `0x${string}`[], minApprovals],
    })
  }

  const handleApprove = () => {
    setError(null)
    approve({
      ...CONTRACTS.labUSDT,
      functionName: 'approve',
      args: [CONTRACTS.groupVault.address, parseLabUSDT(10000)],
    })
  }

  const handleLockStake = (evt: FormEvent) => {
    evt.preventDefault()
    setError(null)

    const amount = parseFloat(stakeAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid stake amount')
      return
    }

    lockStake({
      ...CONTRACTS.groupVault,
      functionName: 'lockStake',
      args: [BigInt(groupId), parseLabUSDT(amount)],
    })
  }

  const needsApproval = !allowance || (allowance as bigint) < parseLabUSDT(parseFloat(stakeAmount) || 0)

  return (
    <Container>
      <PageHeader
        title="Groups"
        subtitle="Form lending circles of 5-8 members for peer accountability"
        action={
          <Button variant="ghost" onClick={() => setShowGroupsHelp(true)}>
            How Groups Work
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          value={groupCount?.toString() || '0'}
          label="Total Groups"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SectionCard title="Create New Group" subtitle="Form a lending circle">
          {error && (
            <div className="mb-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateGroup} className="space-y-4">
            {members.map((member, index) => (
              <Input
                key={index}
                label={`Member ${index + 1} Address`}
                placeholder="0x..."
                value={member}
                onChange={(e) => handleChangeMember(index, e.target.value)}
              />
            ))}
            <Input
              label="Minimum Approvals Required"
              type="number"
              min={3}
              max={8}
              value={minApprovals}
              onChange={(e) => setMinApprovals(Number(e.target.value))}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!isConnected || isCreatingGroup}
              loading={isCreatingGroup}
              icon={Plus}
              className="w-full"
            >
              Create Group
            </Button>
          </form>

          {createGroupHash && (
            <a
              href={`https://explorer.didlab.org/tx/${createGroupHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-sm text-accent hover:text-accent-hover underline"
            >
              View Transaction →
            </a>
          )}

          {createGroupSuccess && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-sm text-emerald-400">
                ✅ Group created successfully! Group ID: {groupCount ? (Number(groupCount) - 1).toString() : '0'}
              </p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Lock Group Stake" subtitle="Lock 5% of max exposure">
          {needsApproval && isConnected && (
            <div className="mb-6 p-4 bg-card-hover rounded-lg border border-border-subtle">
              <p className="text-sm text-text-secondary mb-3">
                First, approve the GroupVault contract to spend your LabUSDT
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

          <form onSubmit={handleLockStake} className="space-y-4">
            <Input
              label="Group ID"
              type="number"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="0"
              min="0"
            />
            <Input
              label="Stake Amount (LabUSDT)"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="100"
              step="0.01"
              min="0"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!isConnected || needsApproval || isLockingStake}
              loading={isLockingStake}
              icon={Shield}
              className="w-full"
            >
              Lock Stake
            </Button>
          </form>

          {lockStakeHash && (
            <a
              href={`https://explorer.didlab.org/tx/${lockStakeHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-sm text-accent hover:text-accent-hover underline"
            >
              View Transaction →
            </a>
          )}

          {lockStakeSuccess && (
            <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-sm text-emerald-400">✅ Stake locked successfully!</p>
            </div>
          )}
        </SectionCard>
      </div>

      <HelpDialog
        isOpen={showGroupsHelp}
        onClose={() => setShowGroupsHelp(false)}
        title="How Groups Work"
        icon="👥"
      >
        <div>
          <h3>5-8 Members</h3>
          <p>
            Groups must have between 5 and 8 members. This size range balances accountability with
            manageable coordination.
          </p>

          <h3>Majority Approval</h3>
          <p>
            Typically 3-of-5 or 5-of-8 approval is needed for loan approvals, ensuring peer accountability.
          </p>

          <h3>Stake Required</h3>
          <p>
            Each member locks 5% of max group exposure as stake, creating skin in the game.
          </p>
        </div>
      </HelpDialog>
    </Container>
  )
}
