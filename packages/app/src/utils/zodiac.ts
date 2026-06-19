import { BrowserProvider, Contract, InterfaceAbi } from 'ethers'
import { getZodiacModuleAddress, KnownContracts } from '@gnosis-guild/zodiac'
import { ModuleType, ModuleVersion } from 'store/modules/models'
import { getModuleAbi } from 'abis'

const MODULE_CONTRACTS: Partial<Record<ModuleType, KnownContracts>> = {
  [ModuleType.TELLOR]: KnownContracts.TELLOR,
  [ModuleType.OPTIMISTIC_GOVERNOR]: KnownContracts.OPTIMISTIC_GOVERNOR,
  [ModuleType.REALITY_ERC20]: KnownContracts.REALITY_ERC20,
  [ModuleType.REALITY_ETH]: KnownContracts.REALITY_ETH,
  [ModuleType.KLEROS_REALITY]: KnownContracts.REALITY_ETH,
  [ModuleType.BRIDGE]: KnownContracts.BRIDGE,
  [ModuleType.DELAY]: KnownContracts.DELAY,
  [ModuleType.ROLES_V1]: KnownContracts.ROLES,
  [ModuleType.ROLES_V2]: KnownContracts.ROLES,
  [ModuleType.EXIT]: KnownContracts.EXIT_ERC20,
  [ModuleType.OZ_GOVERNOR]: KnownContracts.OZ_GOVERNOR,
  [ModuleType.CONNEXT]: KnownContracts.CONNEXT,
}

export function getMastercopyAddress(moduleType: ModuleType) {
  return getZodiacModuleAddress(
    moduleContract(moduleType),
    ModuleVersion[moduleType as keyof typeof ModuleVersion],
  )
}

export function getZodiacContractAddress(name: KnownContracts, version?: string) {
  return getZodiacModuleAddress(name, version)
}

function moduleContract(moduleType: ModuleType) {
  const contract = MODULE_CONTRACTS[moduleType]
  if (!contract) {
    throw new Error(`No Zodiac contract configured for ${moduleType}`)
  }
  return contract
}

export function getModuleInstance(
  name: KnownContracts,
  address: string,
  provider: BrowserProvider,
  version?: string,
) {
  return new Contract(address, getModuleAbi(name, version) as InterfaceAbi, provider)
}
