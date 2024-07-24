import { useMemo } from 'react'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { BrowserProvider } from 'ethers'

const useSafeAppsSDKWithProvider = () => {
  const { sdk, safe } = useSafeAppsSDK()
  const provider = useMemo(() => new BrowserProvider(new SafeAppProvider(safe, sdk)), [sdk, safe])
  return { sdk, safe, provider }
}

export default useSafeAppsSDKWithProvider
