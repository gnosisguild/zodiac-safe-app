import { useState, useEffect } from 'react'
import { EnsPublicClient, createEnsPublicClient, createEnsWalletClient } from '@ensdomains/ensjs'
import { mainnet, sepolia } from 'viem/chains'
import { http } from 'viem'

const mode = import.meta.env.MODE

const useEns = () => {
  const [ensClient, setEnsClient] = useState<EnsPublicClient<any, any> | undefined>(undefined)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const chain = mode === 'development' ? sepolia : mainnet
        
        // Add ENS registry contract (required by ENS client but missing in viem chain definitions)
        const chainWithEns = {
          ...chain,
          contracts: {
            ...chain.contracts,
            ensRegistry: {
              // https://docs.ens.domains/resolution/#reverse-resolution
              address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const,
            },
          },
        } as const

        const client = createEnsPublicClient({
          chain: chainWithEns,
          transport: http(),
        })
        const walletClient = createEnsWalletClient({
          chain: chainWithEns,
          transport: http(),
        })
        setEnsClient(client as EnsPublicClient<any, any>)
      } catch (e) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    initializeClient()
  }, [])

  return { ensClient, loading, error }
}

export default useEns
