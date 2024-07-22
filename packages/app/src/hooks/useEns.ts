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
        const client = createEnsPublicClient({
          chain: mode === 'development' ? sepolia : mainnet,
          transport: http(),
        })
        const walletClient = createEnsWalletClient({
          chain: mode === 'development' ? sepolia : mainnet,
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
