"use client"
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function WalletControls() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  if (!mounted) return null
  if (!isConnected) {
    return (
      <button
        className="nav__link"
        onClick={() => connect({ connector: injected() })}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    )
  }
  return (
    <button className="nav__link" onClick={() => disconnect()}>
      {address?.slice(0, 6)}…{address?.slice(-4)} (Disconnect)
    </button>
  )
}

