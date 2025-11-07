"use client"

import type { AppProps } from 'next/app'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { didlabChain } from '../lib/chains'

import Layout from '../components/Layout'
import '../styles/globals.css'

const rpcUrl = process.env.NEXT_PUBLIC_DIDLAB_RPC_URL || 'https://eth.didlab.org'
const chains = [didlabChain] as const
const transports = {
  [didlabChain.id]: http(rpcUrl)
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
