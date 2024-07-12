import { Transaction, SerializedTransaction } from './models'
import { Module } from '../modules/models'
import { FunctionFragment, Interface } from 'ethers'

export function serializeTransaction(moduleTransaction: Transaction): SerializedTransaction {
  return {
    ...moduleTransaction,
    func: FunctionFragment.from(moduleTransaction.func).format('full'),
  }
}

export function deserializeTransaction(moduleTransaction: SerializedTransaction): Transaction {
  const interf = new Interface([moduleTransaction.func])
  const func = FunctionFragment.from(interf.fragments[0])
  return {
    ...moduleTransaction,
    func,
  }
}

export function getRemoveModuleTxId(module: Module) {
  return `remove_${module.address}_${module.parentModule}`
}
