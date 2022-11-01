import React, { useState } from "react"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import { AddModuleModal } from "../components/AddModuleModal"
import { deployRolesModifier, RolesModifierParams } from "services"
import { ParamInput } from "../../../../components/ethereum/ParamInput"
import { ParamType } from "@ethersproject/abi"
import useSafeAppsSDKWithProvider from "hooks/useSafeAppsSDKWithProvider"

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
    textAlign: "center",
  },
}))

const MULTISEND_ADDRESS = "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761"

export const RolesModifierModal = ({
  open,
  onClose,
  onSubmit,
}: RolesModifierModalProps) => {
  const classes = useStyles()

  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()

  const [errors, setErrors] = useState<Record<keyof RolesModifierParams, boolean>>({
    target: true,
    multisend: true,
  })
  const [params, setParams] = useState<RolesModifierParams>({
    target: safe.safeAddress,
    multisend: MULTISEND_ADDRESS,
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
      const txs = deployRolesModifier(provider, safe.safeAddress, safe.chainId, params)

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
      title="Roles Modifier"
      description="Allows avatars to enforce granular, role-based, permissions for attached modules"
      icon="roles"
      tags={["Stackable", "From Gnosis Guild"]}
      onAdd={handleAddRolesModifier}
      readMoreLink="https://github.com/gnosis/zodiac-modifier-roles"
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography gutterBottom>Parameters</Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={params.target}
            label="Target Address"
            onChange={(value, valid) => onParamChange("target", value, valid)}
          />
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={params.multisend}
            label="Multisend Address"
            onChange={(value, valid) => onParamChange("target", value, valid)}
          />
        </Grid>
      </Grid>
    </AddModuleModal>
  )
}
