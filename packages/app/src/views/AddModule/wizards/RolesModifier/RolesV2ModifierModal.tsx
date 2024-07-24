import React, { useState } from 'react'
import { Grid, InputLabel, makeStyles, Typography } from '@material-ui/core'
import { AddModuleModal } from '../components/AddModuleModal'
import { deployRolesV2Modifier, RolesV2ModifierParams } from 'services'
import { ParamInput } from '../../../../components/ethereum/ParamInput'
import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'
import { MultiSelectBlock, MultiSelectValues } from '../../../../components/MultiSelectBlock'
import { getAddress, ParamType } from 'ethers'

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
  multiSendLabel: {
    color: theme.palette.text.primary,
    marginBottom: 4,
  },
}))

const MULTISEND_141 = '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526' // used in latest Safes
const MULTISEND_CALLONLY_141 = '0x9641d764fc13c8B624c04430C7356C1C7C8102e2' // used in latest Safes

export const RolesV2ModifierModal: React.FC<RolesModifierModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const classes = useStyles()

  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()

  const [fieldsValid, setFieldsValid] = useState<Record<keyof RolesV2ModifierParams, boolean>>({
    target: true,
    multisend: true,
  })
  const [params, setParams] = useState<RolesV2ModifierParams>({
    target: safe.safeAddress,
    multisend: [MULTISEND_141, MULTISEND_CALLONLY_141],
  })

  const isValid = Object.values(fieldsValid).every((field) => field)

  const onParamChange = <Field extends keyof RolesV2ModifierParams>(
    field: Field,
    value: RolesV2ModifierParams[Field],
    valid: boolean,
  ) => {
    setFieldsValid({ ...fieldsValid, [field]: valid })
    setParams({
      ...params,
      [field]: value,
    })
  }

  const handleAddRolesModifier = async () => {
    try {
      const txs = await deployRolesV2Modifier(provider, safe.safeAddress, safe.chainId, params)

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
      title='Roles Modifier'
      description='Allows avatars to enforce granular, role-based, permissions for attached modules'
      icon='roles'
      tags={['Stackable', 'From Gnosis Guild']}
      onAdd={handleAddRolesModifier}
      readMoreLink='https://www.zodiac.wiki/documentation/roles-modifier'
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
          <InputLabel className={classes.multiSendLabel}>MultiSend Addresses</InputLabel>
          <MultiSelectBlock
            invalidText={!fieldsValid.multisend ? 'Please provide valid addresses' : undefined}
            onChange={(items: unknown) => {
              const values = (items as MultiSelectValues[]).map((v) => v.value)
              onParamChange('multisend', values, values.every(isValidAddress))
            }}
            value={params.multisend.map((address) => ({
              value: address,
              label: label(address),
            }))}
            noOptionsMessage={() => 'Paste an address and press enter...'}
            formatCreateLabel={(inputValue) =>
              isValidAddress(inputValue) ? `Add "${inputValue}"` : `Invalid address: ${inputValue}`
            }
          />
        </Grid>
      </Grid>
    </AddModuleModal>
  )
}

const isValidAddress = (address: string) => {
  try {
    getAddress(address)
    return true
  } catch {
    return false
  }
}

const label = (address: string) => {
  if (address === MULTISEND_141) {
    return address + ' (MultiSend v1.4.1)'
  } else if (address === MULTISEND_CALLONLY_141) {
    return address + ' (MultiSendCallOnly v1.4.1)'
  } else {
    return address
  }
}
