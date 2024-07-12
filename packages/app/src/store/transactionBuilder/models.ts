import { FunctionFragment } from 'ethers'
import { Module } from '../modules/models'

export interface TransactionBuilderState {
  open: boolean
  addTransaction: AddTransaction
  transactions: SerializedTransaction[]
}

export interface Transaction {
  id: string
  to: string
  func: FunctionFragment
  params: any[]
  module?: Module
}

export interface SerializedTransaction extends Omit<Transaction, 'func'> {
  func: string
}

export interface AddTransaction {
  func?: string
  params?: any[]
}
