import React, { useState } from 'react'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { AddModuleModal } from '../components/AddModuleModal'
import { deployTellorModule, getTellorOracle } from '../../../../services'
import { useRootSelector } from '../../../../store'
import { AttachModuleForm } from '../components/AttachModuleForm'
import { getDelayModules } from '../../../../store/modules/selectors'
import { TimeSelect } from '../../../../components/input/TimeSelect'
import { ModuleType } from '../../../../store/modules/models'
import { ParamInput } from '../../../../components/ethereum/ParamInput'
import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'
import { ParamType } from 'ethers'

interface TellorModuleModalProps {
  open: boolean

  onClose?(): void

  onSubmit?(): void
}

interface TellorModuleParams {
  owner: string
  oracle: string
  cooldown: string
  expiration: string
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: 'center',
  },
}))

export const TellorModuleModal = ({ open, onClose, onSubmit }: TellorModuleModalProps) => {
  const classes = useStyles()
  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()

  const delayModules = useRootSelector(getDelayModules)
  const [delayModule, setDelayModule] = useState<string>(
    delayModules.length === 1 ? delayModules[0].address : '',
  )
  const [params, setParams] = useState<TellorModuleParams>({
    owner: safe.safeAddress,
    oracle: getTellorOracle(safe.chainId),
    cooldown: '86400',
    expiration: '604800',
  })
  const [validFields, setValidFields] = useState({
    oracle: !!params.oracle,
  })
  const isValid = Object.values(validFields).every((field) => field)

  const onParamChange = <Field extends keyof TellorModuleParams>(
    field: Field,
    value: TellorModuleParams[Field],
    valid?: boolean,
  ) => {
    setParams({
      ...params,
      [field]: value,
    })
    if (valid !== undefined)
      setValidFields({
        ...validFields,
        [field]: valid,
      })
  }

  const handleAddTellorModule = async () => {
    try {
      const args = {
        ...params,
        executor: delayModule || safe.safeAddress,
      }
      const txs = await deployTellorModule(provider, safe.safeAddress, safe.chainId, args)

      await sdk.txs.send({ txs })
      if (onSubmit) onSubmit()
      if (onClose) onClose()
    } catch (error) {
      console.log('Error deploying module: ', error)
    }
  }

  const description = (
    <Typography variant='body2'>
      This will add a timedelay to any transactions created by this module.{' '}
      <b>Note that this delay is cumulative with the cooldown set above</b> (e.g. if both are set to
      24 hours, the cumulative delay before the transaction can be executed will be 48 hours).
    </Typography>
  )

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title='Tellor Module'
      description='Allows successful Snapshot proposals to
      execute transactions using the Tellor oracle.'
      icon='tellor'
      tags={['From Tellor']}
      onAdd={handleAddTellorModule}
      readMoreLink='https://github.com/tellor-io/snapshot-zodiac-module'
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography gutterBottom>Parameters</Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from('address')}
            color='secondary'
            label='Owner Address'
            onChange={(value, valid) => onParamChange('owner', value, valid)}
          />
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from('address')}
            color='secondary'
            value={params.oracle}
            label='Oracle Address'
            onChange={(value, valid) => onParamChange('oracle', value, valid)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label='Cooldown'
            defaultValue={params.cooldown}
            defaultUnit='hours'
            onChange={(value) => onParamChange('cooldown', value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label='Expiration'
            defaultValue={params.expiration}
            defaultUnit='days'
            onChange={(value) => onParamChange('expiration', value)}
          />
        </Grid>
      </Grid>
      {delayModules.length ? (
        <>
          <Typography variant='h6' gutterBottom>
            Deploy Options
          </Typography>
          <AttachModuleForm
            description={description}
            modules={delayModules}
            value={delayModule}
            onChange={(value: string) => setDelayModule(value)}
            type={ModuleType.DELAY}
          />
        </>
      ) : null}
    </AddModuleModal>
  )
}
