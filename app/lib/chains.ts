import { defineChain } from 'viem'

/**
 * DIDLab Trust Testnet chain configuration
 *
 * Chain Details:
 * - Chain ID: 252501
 * - RPC URL: https://eth.didlab.org
 * - Block Explorer: https://explorer.didlab.org
 * - Native Token: TT (TRUST)
 * - Faucet: https://faucet.didlab.org
 */
export const didlabChain = defineChain({
  id: 252501,
  name: 'DIDLab Trust Testnet',
  nativeCurrency: {
    name: 'Trust Token',
    symbol: 'TT',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ['https://eth.didlab.org']
    }
  },
  blockExplorers: {
    default: {
      name: 'DIDLab Explorer',
      url: 'https://explorer.didlab.org'
    }
  },
  testnet: true
})
