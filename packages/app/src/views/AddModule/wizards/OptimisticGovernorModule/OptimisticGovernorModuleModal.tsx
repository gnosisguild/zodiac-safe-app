import React, { useState } from "react"
import { Grid, makeStyles, Typography } from "@material-ui/core"
import { AddModuleModal } from "../components/AddModuleModal"
import {
  deployOptimisticGovernorModule,
  getFinder,
  getCollateral,
} from "../../../../services"
import { useRootSelector } from "../../../../store"
import { AttachModuleForm } from "../components/AttachModuleForm"
import { getDelayModules } from "../../../../store/modules/selectors"
import { TimeSelect } from "../../../../components/input/TimeSelect"
import { ModuleType } from "../../../../store/modules/models"
import { ParamInput } from "../../../../components/ethereum/ParamInput"
import { ParamType } from "@ethersproject/abi"
import {
  collateralOptions,
  CollateralSelect,
} from "../../../../components/input/CollateralSelect"
import useSafeAppsSDKWithProvider from "hooks/useSafeAppsSDKWithProvider"

interface OptimisticGovernorModuleModalProps {
  open: boolean

  onClose?(): void

  onSubmit?(): void
}

interface OptimisticGovernorModuleParams {
  finder: string
  owner: string
  collateral: string
  bond: string
  rules: string
  identifier: string
  liveness: string
  snapshotURL: string
  votingQuorum: string
  votingPeriod: string
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
  },
}))

export const OptimisticGovernorModuleModal = ({
  open,
  onClose,
  onSubmit,
}: OptimisticGovernorModuleModalProps) => {
  const classes = useStyles()
  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()

  const delayModules = useRootSelector(getDelayModules)
  const [delayModule, setDelayModule] = useState<string>(
    delayModules.length === 1 ? delayModules[0].address : "",
  )
  const [isWeth, setIsWeth] = useState<boolean>(true)
  const [params, setParams] = useState<OptimisticGovernorModuleParams>({
    finder: getFinder(safe.chainId),
    owner: safe.safeAddress,
    collateral: getCollateral(safe.chainId, isWeth),
    bond: "2",
    rules: "",
    identifier: "0x4153534552545f54525554480000000000000000000000000000000000000000",
    liveness: "86400",
    snapshotURL: "https://snapshot.org/#/",
    votingQuorum: "5",
    votingPeriod: "24",
  })
  const [validFields, setValidFields] = useState({
    finder: !!params.finder,
    bond: !!params.bond,
    snapshotURL: !!params.snapshotURL,
    votingPeriod: !!params.votingPeriod,
    votingQuorum: !!params.votingQuorum,
  })
  const isValid = Object.values(validFields).every((field) => field)

  const onParamChange = <Field extends keyof OptimisticGovernorModuleParams>(
    field: Field,
    value: OptimisticGovernorModuleParams[Field],
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

  const handleAddOptimisticGovernorModule = async () => {
    try {
      const args = {
        ...params,
        owner: safe.safeAddress,
        executor: delayModule || safe.safeAddress,
      }
      const txs = deployOptimisticGovernorModule(
        provider,
        safe.safeAddress,
        safe.chainId,
        args,
        isWeth,
      )
      await sdk.txs.send({ txs })
      if (onSubmit) onSubmit()
      if (onClose) onClose()
    } catch (error) {
      console.log("Error deploying module: ", error)
    }
  }

  const description = (
    <Typography variant="body2">
      This will add a timedelay to any transactions created by this module.{" "}
      <b>Note that this delay is cumulative with the cooldown set above</b> (e.g. if both
      are set to 24 hours, the cumulative delay before the transaction can be executed
      will be 48 hours).
    </Typography>
  )

  params.rules = `I assert that this transaction proposal is valid according to the following rules: Proposals approved on Snapshot, as verified at ${params.snapshotURL}, are valid as long as there is a minimum quorum of ${params.votingQuorum} and a minimum voting period of ${params.votingPeriod} hours and it does not appear that the Snapshot voting system is being exploited or is otherwise unavailable. The quorum and voting period are minimum requirements for a proposal to be valid. Quorum and voting period values set for a specific proposal in Snapshot should be used if they are more strict than the rules parameter. The explanation included with the on-chain proposal must be the unique IPFS identifier for the specific Snapshot proposal that was approved or a unique identifier for a proposal in an alternative voting system approved by DAO social consensus if Snapshot is being exploited or is otherwise unavailable.`

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="UMA oSnap Module"
      description="Allows successful Snapshot proposals to
      execute transactions using UMA's optimistic oracle."
      icon="optimisticGov"
      tags={["From UMA"]}
      onAdd={handleAddOptimisticGovernorModule}
      readMoreLink="https://docs.uma.xyz/developers/osnap"
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography gutterBottom>Parameters</Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <CollateralSelect
            label="Collateral"
            defaultAddress={params.collateral}
            defaultOption={collateralOptions.WETH}
            onChange={(value) => {
              onParamChange("collateral", value)
              setIsWeth(!isWeth)
            }}
            chainId={safe.chainId}
          />
        </Grid>
        <Grid item xs={6}>
          <ParamInput
            param={ParamType.from("string")}
            color="secondary"
            value={params.bond}
            label="Bond"
            onChange={(value, valid) => onParamChange("bond", value, valid)}
          />
          <Typography className={classes.errorMessage}>
            {Number(params.bond) < 1500 && !isWeth
              ? "Warning: A minimum bond of 1,500 is recommended for USDC"
              : Number(params.bond) < 2 && isWeth
              ? "Warning: A bond of 2 is recommended for WETH"
              : null}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Liveness"
            defaultValue={params.liveness}
            defaultUnit="hours"
            onChange={(value) => onParamChange("liveness", value)}
          />
          <Typography className={classes.errorMessage}>
            {Number(params.liveness) < 86400
              ? "Warning: The minimum recommended liveness period is 24 hours."
              : null}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("string")}
            color="secondary"
            value={params.snapshotURL}
            label="Snapshot Space URL"
            onChange={(value, valid) => onParamChange("snapshotURL", value, valid)}
          />
        </Grid>
        <Grid item xs={6}>
          <ParamInput
            param={ParamType.from("uint256")}
            color="secondary"
            value={params.votingQuorum}
            label="Voting Quorum"
            onChange={(value, valid) => onParamChange("votingQuorum", value, valid)}
          />
        </Grid>
        <Grid item xs={6}>
          <ParamInput
            param={ParamType.from("uint256")}
            color="secondary"
            value={params.votingPeriod}
            label="Voting Period (hours)"
            onChange={(value, valid) => onParamChange("votingPeriod", value, valid)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Rules Parameter:</Typography>
          <Typography>{params.rules}</Typography>
        </Grid>
      </Grid>
      {delayModules.length ? (
        <>
          <Typography variant="h6" gutterBottom>
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
