import { FormEvent, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS, parseLabUSDT } from '../lib/contracts'
import { isValidEthAddress, isPositiveInteger } from '../lib/validation'

export default function AdminPage() {
  const { address: userAddress, isConnected } = useAccount()
  const [address, setAddress] = useState('0x')
  const [level, setLevel] = useState(1)
  const [paramKey, setParamKey] = useState('groupMaxExposure')
  const [paramValue, setParamValue] = useState('2000000000')
  const [attestError, setAttestError] = useState<string | null>(null)
  const [paramError, setParamError] = useState<string | null>(null)

  // Check if user is admin (level >= 2)
  const { data: attestationLevel } = useReadContract({
    ...CONTRACTS.attestationRegistry,
    functionName: 'levelOf',
    args: userAddress ? [userAddress] : undefined,
  })

  // Check if platform is paused
  const { data: isPaused, refetch: refetchPaused } = useReadContract({
    ...CONTRACTS.governanceLite,
    functionName: 'paused',
  })

  // Contract writes
  const { writeContract: attest, data: attestHash } = useWriteContract()
  const { writeContract: setParam, data: setParamHash } = useWriteContract()
  const { writeContract: pause, data: pauseHash } = useWriteContract()
  const { writeContract: unpause, data: unpauseHash } = useWriteContract()

  // Transaction status
  const { isLoading: isAttesting, isSuccess: attestSuccess } = useWaitForTransactionReceipt({
    hash: attestHash,
  })

  const { isLoading: isSettingParam, isSuccess: paramSuccess } = useWaitForTransactionReceipt({
    hash: setParamHash,
  })

  const { isLoading: isPausing, isSuccess: pauseSuccess } = useWaitForTransactionReceipt({
    hash: pauseHash,
  })

  const { isLoading: isUnpausing, isSuccess: unpauseSuccess } = useWaitForTransactionReceipt({
    hash: unpauseHash,
  })

  // Auto-refresh after successful transactions
  if (pauseSuccess || unpauseSuccess) {
    refetchPaused()
  }

  const isAdmin = attestationLevel && Number(attestationLevel) >= 2

  const handleAttest = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setAttestError(null)

    if (!isConnected) {
      setAttestError('Please connect your wallet')
      return
    }

    if (!isAdmin) {
      setAttestError('You must be level 2 admin to attest users')
      return
    }

    // Validate address
    if (!isValidEthAddress(address)) {
      setAttestError('Invalid Ethereum address')
      return
    }

    // Validate level
    if (level < 0 || level > 2) {
      setAttestError('Level must be 0, 1, or 2')
      return
    }

    // Execute attest
    attest({
      ...CONTRACTS.attestationRegistry,
      functionName: 'attest',
      args: [address as `0x${string}`, BigInt(level)],
    })
  }

  const handleParamUpdate = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setParamError(null)

    if (!isConnected) {
      setParamError('Please connect your wallet')
      return
    }

    if (!isAdmin) {
      setParamError('You must be level 2 admin to update parameters')
      return
    }

    // Validate parameter value is a positive integer
    if (!isPositiveInteger(paramValue)) {
      setParamError('Parameter value must be a positive integer')
      return
    }

    const numValue = parseInt(paramValue, 10)

    // Additional validation based on parameter type
    switch (paramKey) {
      case 'rateBpsPer4Weeks':
        if (numValue > 10000) {
          setParamError('Rate cannot exceed 10000 bps (100%)')
          return
        }
        break
      case 'minPrincipal':
      case 'maxPrincipal':
        if (numValue === 0) {
          setParamError('Principal must be greater than 0')
          return
        }
        break
    }

    // Convert to appropriate format based on key
    let valueToSet: bigint
    if (paramKey === 'minPrincipal' || paramKey === 'maxPrincipal') {
      // These are in LabUSDT units (6 decimals)
      valueToSet = parseLabUSDT(numValue)
    } else {
      // Other params are raw numbers
      valueToSet = BigInt(numValue)
    }

    // Execute setParam
    setParam({
      ...CONTRACTS.governanceLite,
      functionName: 'setParam',
      args: [paramKey, valueToSet],
    })
  }

  const handlePause = () => {
    if (!isAdmin) return
    pause({
      ...CONTRACTS.governanceLite,
      functionName: 'pause',
    })
  }

  const handleUnpause = () => {
    if (!isAdmin) return
    unpause({
      ...CONTRACTS.governanceLite,
      functionName: 'unpause',
    })
  }

  return (
    <div className="grid">
      <section className="card">
        <h1>Admin Console</h1>
        <p>
          Governance lite controls issuer allowlist, economic parameters, and pause state. Use a multisig
          wallet in production.
        </p>
        {!isConnected && (
          <div style={{ color: 'var(--gray-300)', marginTop: '1rem' }}>
            Connect your wallet to access admin functions
          </div>
        )}
        {isConnected && !isAdmin ? (
          <div style={{ color: 'red', marginTop: '1rem' }}>
            You must have attestation level 2 or higher to access admin functions
          </div>
        ) : null}
        {isConnected && isAdmin ? (
          <div style={{ color: 'green', marginTop: '1rem' }}>
            ✓ Admin access granted (Level {attestationLevel?.toString()})
          </div>
        ) : null}
      </section>

      {isConnected && isAdmin ? (
        <>
          <section className="card">
            <h2>Attest Pilot User</h2>
            {attestError && <div style={{ color: 'red', marginBottom: '1rem' }}>{attestError}</div>}

            {isAttesting && (
              <div className="notice" style={{ marginBottom: '1rem' }}>
                Attesting user... Check your wallet.
              </div>
            )}

            {attestSuccess && attestHash && (
              <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
                User attested successfully!{' '}
                <a
                  href={`https://explorer.didlab.org/tx/${attestHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              </div>
            )}

            <form className="form" onSubmit={handleAttest}>
              <label>
                Address
                <input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="0x..." />
              </label>
              <label>
                Level
                <select value={level} onChange={(event) => setLevel(Number(event.target.value))}>
                  <option value={0}>0 - Revoked</option>
                  <option value={1}>1 - Basic User</option>
                  <option value={2}>2 - Admin</option>
                </select>
              </label>
              <button type="submit" disabled={isAttesting}>
                {isAttesting ? 'Attesting...' : 'Attest User'}
              </button>
            </form>
          </section>

          <section className="card">
            <h2>Update Parameter</h2>
            {paramError && <div style={{ color: 'red', marginBottom: '1rem' }}>{paramError}</div>}

            {isSettingParam && (
              <div className="notice" style={{ marginBottom: '1rem' }}>
                Updating parameter... Check your wallet.
              </div>
            )}

            {paramSuccess && setParamHash && (
              <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
                Parameter updated successfully!{' '}
                <a
                  href={`https://explorer.didlab.org/tx/${setParamHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              </div>
            )}

            <form className="form" onSubmit={handleParamUpdate}>
              <label>
                Parameter
                <select value={paramKey} onChange={(event) => setParamKey(event.target.value)}>
                  <option value="groupMaxExposure">groupMaxExposure</option>
                  <option value="minPrincipal">minPrincipal</option>
                  <option value="maxPrincipal">maxPrincipal</option>
                  <option value="rateBpsPer4Weeks">rateBpsPer4Weeks</option>
                </select>
              </label>
              <label>
                New value
                <input value={paramValue} onChange={(event) => setParamValue(event.target.value)} />
              </label>
              <button type="submit" disabled={isSettingParam}>
                {isSettingParam ? 'Updating...' : 'Update Parameter'}
              </button>
            </form>
            <div className="notice">
              Always record governance changes in docs/params.md and share with subgraph/data teams.
            </div>
          </section>

          <section className="card-dark">
            <h2>Emergency Pausing</h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Use pause/unpause to halt or restore state-changing credit operations. Current status:{' '}
              <strong>{isPaused ? '⏸️ PAUSED' : '✅ ACTIVE'}</strong>
            </p>

            {(isPausing || isUnpausing) && (
              <div className="notice" style={{ marginBottom: '1rem' }}>
                {isPausing ? 'Pausing platform...' : 'Unpausing platform...'} Check your wallet.
              </div>
            )}

            {pauseSuccess && pauseHash && (
              <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
                Platform paused successfully!{' '}
                <a
                  href={`https://explorer.didlab.org/tx/${pauseHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              </div>
            )}

            {unpauseSuccess && unpauseHash && (
              <div className="notice" style={{ marginBottom: '1rem', background: '#d4edda' }}>
                Platform unpaused successfully!{' '}
                <a
                  href={`https://explorer.didlab.org/tx/${unpauseHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handlePause}
                disabled={isPausing || Boolean(isPaused)}
                className="button"
                style={{ flex: 1, minWidth: '200px' }}
              >
                {isPausing ? 'Pausing...' : '⏸️ Pause Platform'}
              </button>
              <button
                onClick={handleUnpause}
                disabled={isUnpausing || !isPaused}
                className="button button-outline"
                style={{ flex: 1, minWidth: '200px' }}
              >
                {isUnpausing ? 'Unpausing...' : '▶️ Unpause Platform'}
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-300)', marginTop: '1rem' }}>
              Refer to docs/runbook.md for full emergency response procedure.
            </p>
          </section>
        </>
      ) : null}
    </div>
  )
}
