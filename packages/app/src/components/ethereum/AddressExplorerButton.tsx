import React from 'react'
import { ExplorerButton } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import { getExplorerInfo } from '../../utils/explorers'

interface AddressExplorerButtonProps {
  className?: string
  address: string
}

export const AddressExplorerButton: React.FC<AddressExplorerButtonProps> = ({
  address,
  className,
}) => {
  const { safe } = useSafeAppsSDK()
  const safeExplorer = getExplorerInfo(safe.chainId, address)
  if (!safeExplorer) return null
  return <ExplorerButton explorerUrl={safeExplorer} className={className} />
}
