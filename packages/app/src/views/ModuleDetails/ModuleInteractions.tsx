import React, { useEffect, useState } from 'react'
import { ContractInteractions } from './contract/ContractInteractions'
import { getModuleData } from '../../utils/contracts'
import { Module } from '../../store/modules/models'
import { ModuleNoAvailable } from './ModuleNoAvailable'
import { Skeleton } from '@material-ui/lab'

import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'
import { ContractInterface } from 'ethers'

interface ModuleInteractionsProps {
  module: Module
}

export const ModuleInteractions = ({ module }: ModuleInteractionsProps) => {
  const { safe, sdk, provider } = useSafeAppsSDKWithProvider()
  const [loading, setLoading] = useState(true)
  const [abi, setABI] = useState<ContractInterface>()
  useEffect(() => {
    setLoading(true)
    setABI(undefined)
    getModuleData(provider, sdk, safe.chainId, module.address)
      .then(({ abi }) => abi && setABI(abi as any))
      .catch((error) => console.warn('getModuleABI', error))
      .finally(() => setLoading(false))
  }, [module, safe, sdk, provider])

  if (loading) return <Skeleton variant='rect' width={300} height={48} />

  if (!abi) return <ModuleNoAvailable />

  return <ContractInteractions address={module.address} abi={abi} />
}
