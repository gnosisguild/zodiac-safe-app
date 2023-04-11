import React, { useEffect, useState } from "react"
import { Grid, Link, makeStyles, Typography } from "@material-ui/core"
import { Grow } from "../../../../components/layout/Grow"
import { ethers } from "ethers"
import { useRootSelector } from "store"
import { getDelayModules } from "store/modules/selectors"
import { NETWORK, NETWORKS } from "utils/networks"
import { ARBITRATOR_OPTIONS, getArbitrator, getDefaultOracle } from "services"
import { getArbitratorBondToken } from "services/reality-eth"
import { AddModuleModal } from "../components/AddModuleModal"
import { ParamInput } from "components/ethereum/ParamInput"
import { ParamType } from "ethers/lib/utils"
import { Row } from "components/layout/Row"
import { TimeSelect } from "components/input/TimeSelect"
import { ZodiacTextField } from "zodiac-ui-components"
import { arbitratorOptions, ArbitratorSelect } from "components/input/ArbitratorSelect"
import { AttachModuleForm } from "../components/AttachModuleForm"
import { ModuleType } from "store/modules/models"
import { deployRealityModule } from "./services/moduleDeploymentOld"
import useSafeAppsSDKWithProvider from "hooks/useSafeAppsSDKWithProvider"

const SECONDS_IN_DAY = 86400

// TODO: delete this when the new flow is done

interface RealityModuleModalProps {
  open: boolean

  onClose?(): void

  onSubmit?(): void
}

interface RealityModuleParams {
  oracle: string
  templateId: string
  timeout: string
  cooldown: string
  expiration: string
  bond: string
  arbitrator: string
}

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
}))

export const RealityModuleOldModal = ({
  open,
  onClose,
  onSubmit,
}: RealityModuleModalProps) => {
  const classes = useStyles()
  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()
  const delayModules = useRootSelector(getDelayModules)
  const [isERC20, setERC20] = useState(false)
  const [delayModule, setDelayModule] = useState<string>(
    delayModules.length === 1 ? delayModules[0].address : "",
  )
  const [bondToken, setBondToken] = useState(
    NETWORKS[safe.chainId as NETWORK].nativeAsset,
  )
  const [params, setParams] = useState<RealityModuleParams>({
    oracle: getDefaultOracle(safe.chainId),
    templateId: "",
    timeout: (SECONDS_IN_DAY * 2).toString(),
    cooldown: (SECONDS_IN_DAY * 2).toString(),
    expiration: (SECONDS_IN_DAY * 7).toString(),
    bond: "0.1",
    arbitrator: getArbitrator(safe.chainId, ARBITRATOR_OPTIONS.NO_ARBITRATOR),
  })
  const [validFields, setValidFields] = useState({
    oracle: !!params.oracle,
    templateId: !!params.templateId,
    bond: !!params.bond,
  })
  const isValid = Object.values(validFields).every((field) => field)

  useEffect(() => {
    if (params.oracle && ethers.utils.isAddress(params.oracle)) {
      getArbitratorBondToken(provider, params.oracle, safe.chainId)
        .then((response) => {
          setBondToken(response.coin)
          setERC20(response.isERC20)
        })
        .catch(() => {
          setBondToken(NETWORKS[safe.chainId as NETWORK].nativeAsset)
          setERC20(false)
        })
    }
  }, [params.oracle, safe.chainId, provider])

  const onParamChange = <Field extends keyof RealityModuleParams>(
    field: Field,
    value: RealityModuleParams[Field],
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

  const handleAddRealityModule = async () => {
    try {
      const minimumBond = ethers.utils.parseUnits(params.bond, bondToken.decimals)
      const args = {
        ...params,
        executor: delayModule || safe.safeAddress,
        bond: minimumBond.toString(),
      }
      const txs = await deployRealityModule(
        provider,
        safe.safeAddress,
        safe.chainId,
        args,
        isERC20,
      )

      await sdk.txs.send({ txs })
      if (onSubmit) onSubmit()
      if (onClose) onClose()
    } catch (error) {
      console.log("Error deploying module: ", error)
    }
  }

  const handleBondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value || "0"
    const leftZero = value.startsWith("0") && value.length > 1
    let bond = leftZero ? value.substr(1) : value
    bond = bond.startsWith(".") ? "0" + bond : bond

    try {
      ethers.utils.parseUnits(bond, bondToken.decimals)
      onParamChange("bond", bond)
    } catch (error) {
      console.warn("invalid bond", value, error)
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

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="Reality Module"
      description="Allows Reality.eth questions to execute a transaction when resolved."
      icon="reality"
      tags={["Stackable", "From Gnosis Guild"]}
      onAdd={handleAddRealityModule}
      readMoreLink="https://zodiac.wiki/index.php/Category:Reality_Module"
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography gutterBottom>Parameters</Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={params.oracle}
            label="Oracle Address"
            onChange={(value, valid) => onParamChange("oracle", value, valid)}
          />
        </Grid>
        <Grid item xs={12}>
          <Row style={{ alignItems: "center" }}>
            <Typography>TemplateId</Typography>
            <Grow />
            <Link
              color="textSecondary"
              href="https://reality.eth.link/app/template-generator/"
              target="_blank"
            >
              Get a template here
            </Link>
          </Row>
          <ParamInput
            param={ParamType.from("uint256")}
            color="secondary"
            placeholder="10929783"
            label={undefined}
            value={params.templateId}
            onChange={(value, valid) => onParamChange("templateId", value, valid)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Timeout"
            defaultValue={params.timeout}
            defaultUnit="days"
            onChange={(value) => onParamChange("timeout", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Cooldown"
            defaultValue={params.cooldown}
            defaultUnit="days"
            onChange={(value) => onParamChange("cooldown", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TimeSelect
            label="Expiration"
            defaultValue={params.expiration}
            defaultUnit="days"
            onChange={(value) => onParamChange("expiration", value)}
          />
        </Grid>
        <Grid item xs={6}>
          <ZodiacTextField
            label="Bond"
            color="secondary"
            value={params.bond}
            append={bondToken?.symbol}
            onChange={handleBondChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ArbitratorSelect
            label="Arbitrator"
            defaultAddress={params.arbitrator}
            defaultOption={arbitratorOptions.NO_ARBITRATOR}
            onChange={(value) => onParamChange("arbitrator", value)}
            chainId={safe.chainId}
          />
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
