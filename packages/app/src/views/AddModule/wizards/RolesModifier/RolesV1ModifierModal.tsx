import React, { useState } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { AddModuleModal } from '../components/AddModuleModal'
import { deployRolesV1Modifier, RolesModifierParams } from 'services'
import { ParamInput } from '../../../../components/ethereum/ParamInput'
import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'
import { SafeInfo } from '@gnosis.pm/safe-apps-sdk'
import {
  networkAddresses as multisendNetworkAddresses,
  defaultAddress as defaultMultisendAddress,
} from '@gnosis.pm/safe-deployments/dist/assets/v1.3.0/multi_send.json'
import { ParamType } from 'ethers'

interface RolesModifierModalProps {
  open: boolean

  onClose?(): void

  onSubmit?(): void
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: 'center',
  },
}))

export const RolesV1ModifierModal = ({ open, onClose, onSubmit }: RolesModifierModalProps) => {
  const classes = useStyles()

  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()

  const [errors, setErrors] = useState<Record<keyof RolesModifierParams, boolean>>({
    target: true,
    multisend: true,
  })
  const [params, setParams] = useState<RolesModifierParams>({
    target: safe.safeAddress,
    multisend: defaultMultisend(safe),
  })

  const isValid = Object.values(errors).every((field) => field)

  const onParamChange = <Field extends keyof RolesModifierParams>(
    field: Field,
    value: RolesModifierParams[Field],
    valid: boolean,
  ) => {
    setErrors({ ...errors, [field]: valid })
    setParams({
      ...params,
      [field]: value,
    })
  }

  const handleAddRolesModifier = async () => {
    try {
      const txs = await deployRolesV1Modifier(provider, safe.safeAddress, safe.chainId, params)

      await sdk.txs.send({ txs })

      if (onSubmit) onSubmit()
      if (onClose) onClose()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title='Roles Modifier v1'
      description='Legacy version of the Roles Modifier'
      icon='roles'
      tags={['Deprecated', 'Stackable', 'From Gnosis Guild']}
      onAdd={handleAddRolesModifier}
      readMoreLink='https://zodiac.wiki/index.php/Category:Roles_Modifier'
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography gutterBottom>Parameters</Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from('address')}
            color='secondary'
            value={params.target}
            label='Target Address'
            onChange={(value, valid) => onParamChange('target', value, valid)}
          />
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from('address')}
            color='secondary'
            value={params.multisend}
            label='Multisend Address'
            onChange={(value, valid) => onParamChange('multisend', value, valid)}
          />
        </Grid>
      </Grid>
    </AddModuleModal>
  )
}

function defaultMultisend(safeInfo: SafeInfo) {
  const address = (multisendNetworkAddresses as Record<string, string>)[safeInfo.chainId]

  return address || defaultMultisendAddress
}
