import React, { useMemo } from 'react'

import { ContractFunctionQueryBlock } from './ContractFunctionQueryBlock'
import { getReadFunction } from '../../../utils/contracts'
import { ContractFunctionPreviewBlock } from './ContractFunctionPreviewBlock'
import { ContractInterface, FunctionFragment } from 'ethers'

type ModuleListFunctionsProps = {
  address: string
  abi: ContractInterface
  preview?: boolean
}

export const ContractReadFunctionsList = ({ abi, address, preview }: ModuleListFunctionsProps) => {
  const readFunctions: FunctionFragment[] = useMemo(() => getReadFunction(abi), [abi])

  return (
    <>
      {readFunctions.map((func) => {
        if (preview) {
          return <ContractFunctionPreviewBlock key={func.selector} func={func} />
        }

        return <ContractFunctionQueryBlock key={func.selector} address={address} func={func} />
      })}
    </>
  )
}
