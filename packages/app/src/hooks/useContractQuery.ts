import { SetStateAction, useCallback, useState } from 'react'
import { callContract } from '../services'

export type FunctionOutputs = string | BigInt

export const useContractQuery = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FunctionOutputs>()
  const [error, setError] = useState<string | undefined>()

  const fetch = useCallback(async (...params: Parameters<typeof callContract>) => {
    setLoading(true)
    setResult(undefined)
    await callContract(...params)
      .then((response: SetStateAction<FunctionOutputs | undefined>) => {
        setResult(response)
        setError(undefined)
      })
      .catch((error: { message: SetStateAction<string | undefined> }) => {
        setError(error.message)
        setResult(undefined)
      })
      .finally(() => setLoading(false))
  }, [])

  return { loading, error, result, fetch }
}
