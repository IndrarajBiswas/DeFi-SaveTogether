"use client"

import type { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { linea } from 'viem/chains'
import { lineaSepolia } from '../lib/chains'

import Layout from '../components/Layout'
import '../styles/globals.css'

const network = (process.env.NEXT_PUBLIC_NETWORK || 'sepolia').toLowerCase()
const isMainnet = network === 'mainnet' || network === 'linea'

const rpcUrl = isMainnet
  ? process.env.NEXT_PUBLIC_LINEA_RPC_URL || 'https://rpc.linea.build'
  : process.env.NEXT_PUBLIC_LINEA_SEPOLIA_RPC_URL || 'https://rpc.sepolia.linea.build'

const wagmiConfig = createConfig({
  chains: [isMainnet ? linea : lineaSepolia],
  connectors: [injected()],
  transports: {
    [linea.id]: http(rpcUrl),
    [lineaSepolia.id]: http(rpcUrl)
  }
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
