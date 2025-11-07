import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../lib/contracts'

interface LoanApprovalCardProps {
  groupId: bigint
  borrowerAddress: string
  onApprovalComplete?: () => void
}

export default function LoanApprovalCard({ groupId, borrowerAddress, onApprovalComplete }: LoanApprovalCardProps) {
  const { address, isConnected } = useAccount()
  const [error, setError] = useState<string | null>(null)

  // Get group info to check minimum approvals required
  const { data: groupData } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'getGroup',
    args: [groupId],
  })

  // Calculate pseudo loan ID from borrower address
  const pseudoLoanId = BigInt(borrowerAddress)

  // Get current approval count
  const { data: approvalCountData, refetch: refetchApprovals } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'approvalCount',
    args: [groupId, pseudoLoanId],
  })

  // Check if current user has already approved
  const { data: hasApprovedData, refetch: refetchHasApproved } = useReadContract({
    ...CONTRACTS.groupVault,
    functionName: 'hasApproved',
    args: address ? [groupId, pseudoLoanId, address] : undefined,
  })

  const { writeContract: approveLoan, data: approveHash } = useWriteContract()
  const { isLoading: isApproving, isSuccess: approveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  // Auto-refresh after successful approval
  if (approveSuccess) {
    refetchApprovals()
    refetchHasApproved()
    if (onApprovalComplete) {
      onApprovalComplete()
    }
  }

  const handleApprove = () => {
    setError(null)

    if (!isConnected || !address) {
      setError('Please connect your wallet')
      return
    }

    approveLoan({
      ...CONTRACTS.groupVault,
      functionName: 'approveLoan',
      args: [groupId, pseudoLoanId],
    })
  }

  const group = groupData as any
  const approvalCount = approvalCountData ? Number(approvalCountData) : 0
  const minApprovals = group?.minApprovals ? Number(group.minApprovals) : 3
  const hasApproved = hasApprovedData ? Boolean(hasApprovedData) : false
  const isFullyApproved = approvalCount >= minApprovals

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginTop: 0 }}>Loan Request</h3>
          <p style={{ color: 'var(--gray-300)', marginBottom: '0.5rem' }}>
            <strong>Borrower:</strong> {borrowerAddress.slice(0, 6)}...{borrowerAddress.slice(-4)}
          </p>
          <p style={{ color: 'var(--gray-300)', marginBottom: '0.5rem' }}>
            <strong>Group ID:</strong> {groupId.toString()}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <div className="tag" style={{ display: 'inline-block' }}>
              Approvals: {approvalCount} / {minApprovals} required
            </div>
            {isFullyApproved && (
              <div className="tag" style={{ display: 'inline-block', marginLeft: '0.5rem', background: '#d4edda', color: '#155724' }}>
                ✓ Fully Approved
              </div>
            )}
          </div>
        </div>
        <div>
          {hasApproved ? (
            <button disabled style={{ background: 'var(--gray-200)', cursor: 'not-allowed' }}>
              ✓ You Approved
            </button>
          ) : (
            <button onClick={handleApprove} disabled={isApproving || isFullyApproved}>
              {isApproving ? 'Approving...' : 'Approve Loan'}
            </button>
          )}
        </div>
      </div>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {isApproving && (
        <div className="notice" style={{ marginTop: '1rem' }}>
          Approving loan... Check your wallet for transaction confirmation.
        </div>
      )}

      {approveSuccess && approveHash && (
        <div className="notice" style={{ marginTop: '1rem', background: '#d4edda' }}>
          Approval successful!{' '}
          <a
            href={`https://explorer.didlab.org/tx/${approveHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >
            View transaction
          </a>
        </div>
      )}
    </div>
  )
}
