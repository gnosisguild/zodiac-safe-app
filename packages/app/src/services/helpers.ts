import { abi as SafeAbi } from '@gnosis.pm/safe-deployments/dist/assets/v1.3.0/gnosis_safe_l2.json'
import { Interface } from 'ethers'

export const AddressOne = '0x0000000000000000000000000000000000000001'

export const buildTransaction = (
  iface: Interface,
  to: string,
  method: string,
  params: any[],
  value?: string,
) => {
  return {
    to,
    data: iface.encodeFunctionData(method, params),
    value: value || '0',
  }
}

export { SafeAbi }
