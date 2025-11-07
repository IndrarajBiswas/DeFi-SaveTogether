import { FormEvent, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, formatLabUSDT, parseLabUSDT } from '../lib/contracts'
import { isValidEthAddress } from '../lib/validation'

export default function GroupsPage() {
  const { address, isConnected } = useAccount()
  const [members, setMembers] = useState(['', '', '', '', ''])
  const [minApprovals, setMinApprovals] = useState(3)
  const [stakeAmount, setStakeAmount] = useState('100')
  const [groupId, setGroupId] = useState('0')
  const [error, setError] = useState<string | null>(null)

  // Read group count
  const { data: groupCount } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'groupCount',
  })

  // Write functions
  const { writeContract: createGroup, data: createGroupHash } = useWriteContract()
  const { writeContract: lockStake, data: lockStakeHash } = useWriteContract()

  // Wait for transactions
  const { isLoading: isCreatingGroup, isSuccess: createGroupSuccess } = useWaitForTransactionReceipt({ hash: createGroupHash })
  const { isLoading: isLockingStake, isSuccess: lockStakeSuccess } = useWaitForTransactionReceipt({ hash: lockStakeHash })

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
      args: [validMembers as `0x${string}`[], BigInt(minApprovals)],
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

  return (
    <div className="grid">
      <section className="card-hero">
        <h1>👥 Group Management</h1>
        <p>Form lending groups of 5-8 members. Lock stake and approve loans for your peers.</p>
      </section>

      <section className="card">
        <h2>Platform Groups</h2>
        <div className="stat-card">
          <div className="stat-value">{groupCount?.toString() || '0'}</div>
          <div className="stat-label">Total Groups</div>
        </div>
      </section>

      <section className="card">
        <h2>Create New Group</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form className="form" onSubmit={handleCreateGroup}>
          {members.map((member, index) => (
            <label key={index}>
              Member {index + 1} Address
              <input
                placeholder="0x..."
                value={member}
                onChange={(e) => handleChangeMember(index, e.target.value)}
              />
            </label>
          ))}
          <label>
            Minimum Approvals Required
            <input
              type="number"
              min={3}
              max={8}
              value={minApprovals}
              onChange={(e) => setMinApprovals(Number(e.target.value))}
            />
          </label>
          <button type="submit" disabled={!isConnected || isCreatingGroup} className="button">
            {isCreatingGroup ? (
              <>
                <span className="spinner spinner-white" /> Creating Group...
              </>
            ) : (
              'Create Group'
            )}
          </button>
        </form>

        {createGroupHash && (
          <a
            href={`https://explorer.didlab.org/tx/${createGroupHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View Transaction →
          </a>
        )}

        {createGroupSuccess && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            ✅ Group created successfully! Group ID: {groupCount ? (Number(groupCount) - 1).toString() : '0'}
          </div>
        )}
      </section>

      <section className="card">
        <h2>Lock Group Stake</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--gray-700)' }}>
          Each member must lock 5% of max group exposure as stake.
        </p>

        <form className="form" onSubmit={handleLockStake}>
          <label>
            Group ID
            <input
              type="number"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="0"
              min="0"
            />
          </label>
          <label>
            Stake Amount (LabUSDT)
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="100"
              step="0.01"
              min="0"
            />
          </label>
          <button type="submit" disabled={!isConnected || isLockingStake} className="button">
            {isLockingStake ? (
              <>
                <span className="spinner spinner-white" /> Locking Stake...
              </>
            ) : (
              'Lock Stake'
            )}
          </button>
        </form>

        {lockStakeHash && (
          <a
            href={`https://explorer.didlab.org/tx/${lockStakeHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="tx-link"
          >
            View Transaction →
          </a>
        )}

        {lockStakeSuccess && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            ✅ Stake locked successfully!
          </div>
        )}
      </section>

      <section className="card-dark">
        <h2>How Groups Work</h2>
        <ul className="list" style={{ marginTop: '1rem' }}>
          <li><strong>5-8 Members:</strong> Groups must have between 5 and 8 members</li>
          <li><strong>Majority Approval:</strong> Typically 3-of-5 or 5-of-8 approval needed</li>
          <li><strong>Stake Required:</strong> Each member locks 5% of max exposure</li>
          <li><strong>Peer Accountability:</strong> Group approves loans, shares default risk</li>
          <li><strong>One Loan at a Time:</strong> Groups can only have one active loan</li>
        </ul>
      </section>
    </div>
  )
}
