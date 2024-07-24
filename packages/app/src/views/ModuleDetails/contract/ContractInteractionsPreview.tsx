import React from 'react'
import { makeStyles } from '@material-ui/core'
import { ZodiacPaper } from 'zodiac-ui-components'
import { ContractReadFunctionsList } from './ContractReadFunctionsList'
import { ContractOperationToggleButtons } from '../ContractOperationToggleButtons'
import { ContractInterface } from 'ethers'

interface ContractInteractionsPreviewProps {
  address: string
  abi: ContractInterface
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2.5),
    marginTop: theme.spacing(3),
  },
}))

export const ContractInteractionsPreview = ({ address, abi }: ContractInteractionsPreviewProps) => {
  const classes = useStyles()

  return (
    <>
      <ContractOperationToggleButtons value='read' disabled />

      <ZodiacPaper
        borderStyle='double'
        className={classes.content}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <ContractReadFunctionsList preview address={address} abi={abi} />
      </ZodiacPaper>
    </>
  )
}
