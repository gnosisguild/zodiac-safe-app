import { useState } from "react"
import { validationCredentials } from "../service/monitoring"

export const useMonitoringValidation = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean | undefined>()

  const execute = async (apiKey: string, apiSecret: string) => {
    setLoading(true)
    setError(undefined)
    try {
      await validationCredentials({
        apiKey,
        apiSecret,
      }).then((res) => {
        setLoading(false)
        if (res.status === 200) {
          return setError(false)
        }
        setError(true)
      })
    } catch {
      setLoading(false)
    }
  }

  return { loading, error, execute }
}
