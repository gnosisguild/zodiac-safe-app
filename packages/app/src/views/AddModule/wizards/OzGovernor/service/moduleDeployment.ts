import {
  encodeDeployProxy,
  KnownContracts,
  predictProxyAddress,
} from '@gnosis-guild/zodiac'
import { getMastercopyAddress, getZodiacContractAddress } from 'utils/zodiac'
import { ModuleType, ZodiacHelperContractVersion } from 'store/modules/models'
import { enableModule, TxWitMeta } from 'services'
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk'

const MULTI_SEND_CONTRACT = import.meta.env.VITE_MULTI_SEND_CONTRACT
if (MULTI_SEND_CONTRACT == null) {
  throw new Error('The MULTI_SEND_CONTRACT environment variable is not set.')
}

const MODULE_PROXY_FACTORY = getZodiacContractAddress(
  KnownContracts.FACTORY,
  ZodiacHelperContractVersion.FACTORY,
)

export type CreateTokenArgs = {
  name: string
  symbol: string
  kind: 'ERC20' | 'ERC721'
}

const createOzGovernorDeploymentTx = async (
  safeAddress: string,
  tokenAddress: string,
  name: string,
  votingDelayInBlocks: number,
  votingPeriodInBlocks: number,
  proposalThreshold: number,
  quorumPercent: number,
): Promise<TxWitMeta> => {
  // input validation
  if (safeAddress == null) {
    throw new Error('No safe address provided')
  }
  if (tokenAddress == null) {
    throw new Error('No token address provided')
  }
  if (name == null) {
    throw new Error('No name provided')
  }
  if (votingDelayInBlocks == null) {
    throw new Error('No voting delay provided')
  }
  if (votingPeriodInBlocks == null) {
    throw new Error('No voting period provided')
  }
  if (proposalThreshold == null) {
    throw new Error('No proposal threshold provided')
  }
  if (quorumPercent == null) {
    throw new Error('No quorum percent provided')
  }
  if (quorumPercent > 100 || quorumPercent < 0) {
    throw new Error('Quorum percent must be between 0 and 100')
  }

  const initData = {
    values: [
      safeAddress, // owner
      safeAddress, // target
      MULTI_SEND_CONTRACT, // multisend
      tokenAddress, // token
      name, // name
      votingDelayInBlocks.toString(), // votingDelay
      votingPeriodInBlocks.toString(), // votingPeriod
      proposalThreshold.toString(), // proposalThreshold
      quorumPercent.toString(), // quorum
      '0', // initialVoteExtension
    ],
    types: [
      'address',
      'address',
      'address',
      'address',
      'string',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint64',
    ],
  }

  const saltNonce = Date.now().toString()
  const mastercopy = getMastercopyAddress(ModuleType.OZ_GOVERNOR)
  const creationTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs: initData,
    saltNonce,
  })
  const expectedAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs: initData,
    saltNonce,
  })

  return {
    txs: [
      {
        to: String(creationTx.to),
        data: String(creationTx.data),
        value: '0',
      },
    ], // transactions to be executed by the safe
    meta: { expectedAddress }, // any additional data needed from the setup process
  }
}

export const createVotesTokenDeploymentTx = async (
  safeAddress: string,
  tokenName: string,
  tokenSymbol: string,
  kind: 'ERC20' | 'ERC721',
): Promise<TxWitMeta> => {
  if (safeAddress == null) {
    throw new Error('No safe address provided')
  }
  if (tokenName == null) {
    throw new Error('No token name provided')
  }
  if (tokenSymbol == null) {
    throw new Error('No token symbol provided')
  }
  if (kind !== 'ERC20' && kind !== 'ERC721') {
    throw new Error('Invalid token kind')
  }

  const initData = {
    values: [
      safeAddress, // owner
      tokenName, // name
      tokenSymbol, // symbol
    ],
    types: ['address', 'string', 'string'],
  }

  const saltNonce = Date.now().toString()
  const type = kind === 'ERC20' ? KnownContracts.ERC20_VOTES : KnownContracts.ERC721_VOTES
  const mastercopy = getZodiacContractAddress(type, ZodiacHelperContractVersion.VOTES_TOKEN)
  const creationTx = encodeDeployProxy({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs: initData,
    saltNonce,
  })
  const expectedAddress = predictProxyAddress({
    factory: MODULE_PROXY_FACTORY,
    mastercopy,
    setupArgs: initData,
    saltNonce,
  })

  return {
    txs: [
      {
        to: String(creationTx.to),
        data: String(creationTx.data),
        value: '0',
      },
    ], // transactions to be executed by the safe
    meta: { expectedAddress }, // any additional data needed from the setup process
  }
}

export const createAndEnableOzGovernorDeploymentTx = async (
  safeSdk: SafeAppsSDK,
  safeAddress: string,
  name: string,
  votingDelayInBlocks: number,
  votingPeriodInBlocks: number,
  proposalThreshold: number,
  quorumPercent: number,
  tokenAddress?: string,
  createTokenArgs?: CreateTokenArgs,
) => {
  if (tokenAddress == null && createTokenArgs == null) {
    throw new Error('No token address or create token args provided')
  } else if (tokenAddress != null && createTokenArgs != null) {
    throw new Error('Both token address and create token args provided')
  }
  const txs = []
  if (createTokenArgs != null) {
    const { txs: createTokenTxs, meta } = await createVotesTokenDeploymentTx(
      safeAddress,
      createTokenArgs.name,
      createTokenArgs.symbol,
      createTokenArgs.kind,
    )
    txs.push(...createTokenTxs)

    if (meta?.expectedAddress == null) {
      throw new Error('No expected address returned from token creation')
    }
    tokenAddress = meta.expectedAddress
  }

  if (tokenAddress == null) {
    throw new Error(
      'No token address provided. Should not be possible. Either the token address should be provided or a new token should be deployed.',
    )
  }

  const { txs: createOzGovernorTxs, meta } = await createOzGovernorDeploymentTx(
    safeAddress,
    tokenAddress,
    name,
    votingDelayInBlocks,
    votingPeriodInBlocks,
    proposalThreshold,
    quorumPercent,
  )
  txs.push(...createOzGovernorTxs)
  if (meta?.expectedAddress == null) {
    throw new Error('The expected value is missing')
  }
  const enableModuleTx = enableModule(safeAddress, meta.expectedAddress)
  txs.push(enableModuleTx)

  return safeSdk.txs.send({ txs: txs }).catch((e) => {
    console.error(e)
    throw new Error('Error when proposing transactions to the Safe')
  })
}
