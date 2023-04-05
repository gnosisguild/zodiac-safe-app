import React, { useEffect, useState } from "react"
import { Box, Grid, Link, makeStyles, Typography } from "@material-ui/core"
import { ethers } from "ethers"
import { useRootSelector } from "store"
import { getDelayModules } from "store/modules/selectors"
import { NETWORK, NETWORKS } from "utils/networks"
import { getDefaultOracle, getKlerosAddress } from "services"
import { AddModuleModal } from "../components/AddModuleModal"
import { TimeSelect } from "components/input/TimeSelect"
import { colors, ZodiacTextField } from "zodiac-ui-components"
import { AttachModuleForm } from "../components/AttachModuleForm"
import { ModuleType } from "store/modules/models"
import useSafeAppsSDKWithProvider from "hooks/useSafeAppsSDKWithProvider"
import { deployRealityModule } from "../RealityModule/service/moduleDeployment"
import {
  addSafeSnapToSnapshotSpaceTxs,
  DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS,
} from "../RealityModule/service/setupService"
import {
  Data as TemplateData,
  getDefaultTemplateQuestion,
} from "../RealityModule/sections/Oracle/components/OracleTemplate"
import * as snapshot from "services/snapshot"
import { checkIfIsController, getEnsTextRecord } from "services/ens"
import { Loader } from "@gnosis.pm/safe-react-components"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined"

const SECONDS_IN_DAY = 86400

interface RealityModuleModalProps {
  open: boolean

  onClose?(): void

  onSubmit?(): void
}

interface RealityModuleParams {
  snapshotEns: string
  timeout: string
  cooldown: string
  expiration: string
  bond: string
}
const useStyles = makeStyles((theme) => ({
  errorIcon: {
    fill: "rgba(244, 67, 54, 1)",
    width: "20px",
  },
  warningIcon: {
    fill: "rgba(230, 230, 54, 1)",
    width: "20px",
  },
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
  loadingContainer: {
    marginRight: 4,
    padding: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    height: 14,
    width: 14,
    border: `1px solid ${colors.tan[300]}`,
  },
  spinner: {
    width: "8px !important",
    height: "8px !important",
    color: `${colors.tan[300]} !important`,
  },
  detailsContainer: {
    width: "95%",
  },
  messageContainer: {
    width: "85%",
    fill: "rgba(244, 67, 54, 1)",
  },
  errorMessageDetails: {
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
    color: "rgba(244, 67, 54, 1)",
  },
  warningMessageDetails: {
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
    color: "rgba(230, 230, 54, 1)",
  },
  errorMessage: {
    fontSize: 12,
    color: "rgba(244, 67, 54, 1)",
    fontWeight: "bolder",
  },
  warningMessage: {
    fontSize: 12,
    color: "rgba(230, 230, 54, 1)",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
}))

const PropStatus: React.FC<{
  status: "error" | "warning" | null
  message: string | null
  link?: string
}> = ({ status, message, link }) => {
  const classes = useStyles()

  return (
    status && (
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={1}>
          {status === "error" && <ErrorOutlineIcon className={classes.errorIcon} />}
          {status === "warning" && (
            <WarningOutlinedIcon className={classes.warningIcon} />
          )}
        </Grid>
        <Grid item className={classes.detailsContainer} xs={11}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item className={classes.messageContainer}>
              <Typography
                className={
                  status === "error" ? classes.errorMessage : classes.warningMessage
                }
              >
                {message}
              </Typography>
            </Grid>
            {link ? (
              <Grid item>
                <Link
                  className={
                    status === "error"
                      ? classes.errorMessageDetails
                      : classes.warningMessageDetails
                  }
                  href={link}
                  target="_blank"
                >
                  Details
                </Link>
              </Grid>
            ) : (
              <Grid></Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  )
}

export const KlerosRealityModuleModal = ({
  open,
  onClose,
  onSubmit,
}: RealityModuleModalProps) => {
  const classes = useStyles()
  const { sdk, safe, provider } = useSafeAppsSDKWithProvider()
  const delayModules = useRootSelector(getDelayModules)
  const [delayModule, setDelayModule] = useState<string>(
    delayModules.length === 1 ? delayModules[0].address : "",
  )

  const bondToken = NETWORKS[safe.chainId as NETWORK].nativeAsset
  const [params, setParams] = useState<RealityModuleParams>({
    snapshotEns: "",
    timeout: (SECONDS_IN_DAY * 2).toString(),
    cooldown: (SECONDS_IN_DAY * 2).toString(),
    expiration: (SECONDS_IN_DAY * 7).toString(),
    bond: "0.1",
  })
  const [loadingEns, setLoadingEns] = useState<boolean>(false)
  const [loadedEns, setLoadedEns] = useState<boolean>(false)
  const [validEns, setValidEns] = useState<boolean>(false)
  const [daorequirements, setDaorequirements] = useState<string>("")

  const [isController, setIsController] = useState<boolean>(false)
  const [isSafesnapInstalled, setIsSafesnapInstalled] = useState<boolean>(false)
  const validSnapshot = () =>
    !!params.snapshotEns && params.snapshotEns.includes(".eth") && !loadingEns && validEns

  const [validFields, setValidFields] = useState({
    snapshotEns: validSnapshot(),
    bond: !!params.bond,
  })

  const isValid = Object.values(validFields).every((field) => field)

  const validateEns = async () => {
    const address = await provider.resolveName(params.snapshotEns)
    console.log({ address })
    if (address) {
      const snapshotSpace = await snapshot.getSnapshotSpaceSettings(
        params.snapshotEns,
        safe.chainId,
      )
      const daorequirements = await getEnsTextRecord(
        params.snapshotEns,
        "daorequirements",
        provider,
      )
      setDaorequirements(daorequirements[0])
      setValidEns(snapshotSpace !== undefined)
      if (snapshotSpace !== undefined) {
        setIsSafesnapInstalled(!!snapshotSpace.plugins?.safeSnap)
        const isController = await checkIfIsController(
          provider,
          params.snapshotEns,
          safe.safeAddress,
        )
        setIsController(isController)
        // We don't check if SafeSnap is installed, because:
        // - either have no control
        // - we have control, and we will create it or overwrite it for the given chain
        console.log({ isController, snapshotSpace })
        console.log({ snapshotSpace })
      }
    }
    setLoadedEns(true)
  }

  // snapshot ens validation
  useEffect(() => {
    if (params.snapshotEns) {
      if (params.snapshotEns.includes(".eth")) {
        setLoadingEns(true)
        const validateInfo = async () => {
          await validateEns()
          setLoadingEns(false)
        }
        validateInfo()
      }
    }
  }, [params.snapshotEns])

  // add appropriate default amounts, chain dependant.
  // 1 ETH, 1500 xDAI, 1000 MATIC.
  useEffect(() => {
    if (safe.chainId) {
      const defaultAmount =
        safe.chainId === 1 ? "1" : safe.chainId === 100 ? "1500" : "1000"
      setParams({ ...params, bond: defaultAmount })
    }
  }, [safe.chainId])

  // on change in params, recheck validation
  useEffect(() => {
    setValidFields({
      snapshotEns: validSnapshot(),
      bond: !!params.bond,
    })
  }, [params, loadingEns])

  const onParamChange = <Field extends keyof RealityModuleParams>(
    field: Field,
    value: RealityModuleParams[Field],
    valid?: boolean,
  ) => {
    if (field === "snapshotEns") setLoadedEns(false)
    setParams({
      ...params,
      [field]: value,
    })
  }

  const handleAddRealityModule = async () => {
    try {
      const minimumBond = ethers.utils.parseUnits(params.bond, bondToken.decimals)
      const args = {
        ...params,
        oracle: getDefaultOracle(safe.chainId),
        arbitrator: getKlerosAddress(safe.chainId),
        executor: delayModule || safe.safeAddress,
        bond: minimumBond.toString(),
      }

      const templateQuestion = getDefaultTemplateQuestion(args.snapshotEns)
      const templateData: TemplateData = {
        templateType: "default",
        language: "english",
        category: "DAO proposal",
        templateQuestion: templateQuestion,
      }
      const deploymentRealityModuleTxsMm = await deployRealityModule(
        provider,
        safe.safeAddress,
        DETERMINISTIC_DEPLOYMENT_HELPER_ADDRESS,
        safe.chainId,
        args,
        templateData,
      )

      let txs = [...deploymentRealityModuleTxsMm.txs]
      // We can only batch the SafeSnap creation when Safe is controller + mainnet
      // Otherwise, just create the module, hope the user got the hint and opened Details
      // to figure out how to set up SafeSnap in the space themselves.
      if (isController && safe.chainId === 1) {
        const realityModuleAddress =
          deploymentRealityModuleTxsMm.meta?.expectedModuleAddress

        if (realityModuleAddress == null) {
          throw new Error(
            "The calculated reality module address is 'null'. This should be handled in the 'statusCallback' function.",
          )
        }
        const { txs: safeSnapTxs } = await addSafeSnapToSnapshotSpaceTxs(
          provider,
          args.snapshotEns,
          realityModuleAddress,
          safe.chainId,
        )
        txs.push(safeSnapTxs[0])
      }

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
      title="Kleros Reality Module"
      description="Deploy the Reality Module, automatically setting up Kleros as the arbitrator."
      icon="reality"
      tags={["Stackable", "From Kleros"]}
      onAdd={handleAddRealityModule}
      readMoreLink="https://github.com/gnosis/zodiac-module-reality"
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography gutterBottom>Parameters</Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <ZodiacTextField
            value={params.snapshotEns}
            onChange={(e) => onParamChange("snapshotEns", e.target.value, true)}
            label="Snapshot Name"
            placeholder="gnosis.eth"
            rightIcon={
              <>
                {loadingEns && (
                  <Box className={classes.loadingContainer}>
                    <Loader size="sm" className={classes.spinner} />
                  </Box>
                )}
              </>
            }
          />
          {loadedEns &&
            (validSnapshot() ? (
              isController && safe.chainId === 1 ? (
                isSafesnapInstalled ? (
                  <div>
                    SafeSnap plugin is already installed, and will be overwritten.
                  </div>
                ) : (
                  <div>The SafeSnap plugin will be automatically installed.</div>
                )
              ) : (
                // A way to paste the safesnap plugin info is here.
                <PropStatus
                  message="Install SafeSnap after creating the module."
                  link="https://kleros.gitbook.io/docs/integrations/types-of-integrations/1.-dispute-resolution-integration-plan/channel-partners/kleros-reality-module#safesnap"
                  status="warning"
                />
              )
            ) : (
              <PropStatus message="This Snapshot space does not exist." status="error" />
            ))}
          {loadedEns &&
            daorequirements === "" && (
               // Notice on how to setup DAO requirements, which appear on template.
              <PropStatus
                message="Missing DAO requirements ENS record."
                link="https://kleros.gitbook.io/docs/integrations/types-of-integrations/1.-dispute-resolution-integration-plan/channel-partners/kleros-reality-module#missing-daorequirements"
                status="warning"
              />
            )}
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
            label={`Bond`}
            prefix={bondToken.symbol}
            color="secondary"
            value={params.bond}
            onChange={handleBondChange}
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
