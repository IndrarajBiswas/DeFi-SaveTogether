import { createPublicClient, http } from 'viem'

import { didlabChain } from './chains'

const fallbackRpcUrl = 'https://eth.didlab.org'
const rpcUrl =
  process.env.NEXT_PUBLIC_DIDLAB_RPC_URL ??
  process.env.DIDLAB_RPC_URL ??
  fallbackRpcUrl

if (rpcUrl === fallbackRpcUrl) {
  // eslint-disable-next-line no-console
  console.warn('Using default DIDLab RPC URL. Set NEXT_PUBLIC_DIDLAB_RPC_URL/DIDLAB_RPC_URL to override.')
}

export const publicClient = createPublicClient({
  chain: didlabChain,
  transport: http(rpcUrl)
})

export const activeChain = didlabChain
