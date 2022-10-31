import { useMemo } from "react"
import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider"
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { ethers } from "ethers"

const useSafeAppsSDKWithProvider = () => {
  const { sdk, safe } = useSafeAppsSDK()
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)),
    [sdk, safe],
  )
  return { sdk, safe, provider }
}

export default useSafeAppsSDKWithProvider
