import { getZodiacModuleAbi, KnownContracts } from '@gnosis-guild/zodiac'
import { InterfaceAbi } from 'ethers'
import TellorAbi from './Tellor.json'
import OptimisticGovernorAbi from './OptimisticGovernor.json'

// As of @gnosis-guild/zodiac v5 the package no longer ships ABIs for these
// contracts (their canonical addresses are still registered), so we vendor the
// ABIs locally and resolve them here, falling back to the package otherwise.
const LOCAL_ABIS: Partial<Record<KnownContracts, InterfaceAbi>> = {
  [KnownContracts.TELLOR]: TellorAbi as InterfaceAbi,
  [KnownContracts.OPTIMISTIC_GOVERNOR]: OptimisticGovernorAbi as InterfaceAbi,
}

export function getModuleAbi(name: KnownContracts, version?: string): InterfaceAbi {
  const localAbi = LOCAL_ABIS[name]
  if (localAbi) {
    return localAbi
  }
  return getZodiacModuleAbi(name, version) as InterfaceAbi
}
