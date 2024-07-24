import React from 'react'

import { Grid } from '@material-ui/core'
import { ParamInput, ParamInputProps } from '../../../components/ethereum/ParamInput'
import { DisplayField } from '../../../components/input/DisplayField'
import { formatDisplayParamValue } from '../../../utils/contracts'
import { FunctionFragment } from 'ethers'

export type TransactionBlockFieldsProps<Edit = boolean> = Edit extends false
  ? {
      edit: Edit
      func: FunctionFragment
      params: any[]
    }
  : {
      edit: Edit
      paramInputProps: ParamInputProps[]
    }

export const TransactionBlockFields = (props: TransactionBlockFieldsProps) => {
  const fields = props.edit
    ? props.paramInputProps.map((props, index) => (
        <Grid item key={index} xs={12} md={6}>
          <ParamInput key={index} {...props} />
        </Grid>
      ))
    : props.func.inputs.map((param, index) => (
        <Grid item key={index} xs={12} md={6}>
          <DisplayField
            label={`${param.name} (${param.type})`}
            value={formatDisplayParamValue(param, props.params[index])}
          />
        </Grid>
      ))

  return (
    <Grid container spacing={2}>
      {fields}
    </Grid>
  )
}
