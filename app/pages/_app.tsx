"use client"

import type { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { linea } from 'viem/chains'
import { lineaSepolia, trustChain } from '../lib/chains'

import Layout from '../components/Layout'
import '../styles/globals.css'

const network = (process.env.NEXT_PUBLIC_NETWORK || 'sepolia').toLowerCase()
const chainConfig = (() => {
  switch (network) {
    case 'mainnet':
    case 'linea':
      return {
        chain: linea,
        rpcUrl: process.env.NEXT_PUBLIC_LINEA_RPC_URL || 'https://rpc.linea.build'
      }
    case 'trust':
    case 'trustnet':
      return {
        chain: trustChain,
        rpcUrl: process.env.NEXT_PUBLIC_TRUST_RPC_URL || 'https://eth.didlab.org'
      }
    case 'sepolia':
    default:
      return {
        chain: lineaSepolia,
        rpcUrl: process.env.NEXT_PUBLIC_LINEA_SEPOLIA_RPC_URL || 'https://rpc.sepolia.linea.build'
      }
  }
})()

const chains = [chainConfig.chain] as const
const transports = {
  [chainConfig.chain.id]: http(chainConfig.rpcUrl)
} as Record<(typeof chains)[number]['id'], ReturnType<typeof http>>

const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports
})

export default function MicrofinanceApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
