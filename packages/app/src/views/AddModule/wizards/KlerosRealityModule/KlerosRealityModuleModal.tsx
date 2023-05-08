import React, { useEffect, useState, useCallback, useMemo } from "react"
import {
  Box,
  Grid,
  Link,
  makeStyles,
  Switch,
  Typography,
  withStyles,
} from "@material-ui/core"
import debounce from "lodash.debounce"
import { ethers } from "ethers"
import { NETWORK, NETWORKS } from "utils/networks"
import { getDefaultOracle, getKlerosAddress } from "services"
import { AddModuleModal } from "../components/AddModuleModal"
import { TimeSelect } from "components/input/TimeSelect"
import { colors, ZodiacTextField } from "zodiac-ui-components"
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
import { Icon, Loader } from "@gnosis.pm/safe-react-components"
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline"
import WarningOutlinedIcon from "@material-ui/icons/WarningOutlined"
import { MonitoringSectionData } from "../RealityModule/sections/Monitoring"
import { setUpMonitoring } from "../RealityModule/service/monitoring"
import { ActionButton } from "../../../../components/ActionButton"
import { ReactComponent as ArrowUpIcon } from "../../../../assets/icons/arrow-up-icon.svg"
import { ReactComponent as CheckmarkIcon } from "../../../../assets/icons/checkmark-nofill.svg"

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
    color: `yellow !important`,
    fill: `yellow !important`,
    opacity: "100% !important",
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
  linkStyle: {
    color: "rgba(190, 190, 120, 1)",
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
}))

const CustomSwitch = withStyles({
  switchBase: {
    "&.Mui-checked": { color: "white" },
  },
  colorSecondary: {
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "yellow",
    },
  },
  track: {
    backgroundColor: "black",
  },
})(Switch)

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
  // hack to resolve mainnet ENS
  const mainnetProvider = useMemo(
    () => new ethers.providers.InfuraProvider(1, process.env.REACT_APP_INFURA_ID),
    [],
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
  const validSnapshot =
    !!params.snapshotEns &&
    params.snapshotEns.includes(".eth") &&
    !loadingEns &&
    loadedEns &&
    validEns

  const [validFields, setValidFields] = useState({
    snapshotEns: validSnapshot,
    bond: !!params.bond,
  })

  const [openMonitoring, setOpenMonitoring] = useState<boolean>(false)
  const [apiKey, setApiKey] = useState<string | undefined>()
  const [apiSecret, setApiSecret] = useState<string | undefined>()
  const [currentEmail, setCurrentEmail] = useState<string>("")
  const [emails, setEmails] = useState<string[]>([])
  const [discordKey, setDiscordKey] = useState<string | undefined>()
  const [telegramBotToken, setTelegramBotToken] = useState<string | undefined>()
  const [telegramChatId, setTelegramChatId] = useState<string | undefined>()

  const [step, setStep] = useState<"form" | "confirm">("form")

  const isValid = Object.values(validFields).every((field) => field)
  const emailIsValid =
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(currentEmail) && !emails.includes(currentEmail)

  const canConfirm =
    isValid &&
    (!openMonitoring ||
      (apiKey !== undefined &&
        apiSecret !== undefined &&
        (emails.length > 0 || discordKey || (telegramBotToken && telegramChatId))))

  const validateEns = useCallback(async () => {
    const address = await mainnetProvider.resolveName(params.snapshotEns)
    console.log({ address })
    if (address) {
      const snapshotSpace = await snapshot.getSnapshotSpaceSettings(
        params.snapshotEns,
        safe.chainId,
      )
      const daorequirements = await getEnsTextRecord(
        params.snapshotEns,
        "daorequirements",
        mainnetProvider,
      )
      setDaorequirements(daorequirements[0])
      setValidEns(snapshotSpace !== undefined)
      if (snapshotSpace !== undefined) {
        setIsSafesnapInstalled(!!snapshotSpace.plugins?.safeSnap)
        const isController = await checkIfIsController(
          mainnetProvider,
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
    } else {
    }
  }, [params.snapshotEns, safe.chainId, safe.safeAddress, mainnetProvider])

  const debouncedSnapshotEnsValidation = debounce(() => {
    setValidEns(false)
    setDaorequirements("")
    setIsController(false)
    setIsSafesnapInstalled(false)
    setLoadedEns(false)
    if (params.snapshotEns && params.snapshotEns.includes(".eth")) {
      setLoadingEns(true)
      const validateInfo = async () => {
        await validateEns()
        setLoadingEns(false)
        setLoadedEns(true)
      }
      validateInfo()
    }
  }, 300)

  // snapshot ens validation
  useEffect(() => {
    debouncedSnapshotEnsValidation()
  }, [params, params.snapshotEns, validateEns])

  // add appropriate default amounts, chain dependant.
  // 1 ETH, 1500 xDAI, 1000 MATIC. Defaults to 1 unit otherwise.
  useEffect(() => {
    if (safe.chainId) {
      const defaultAmount =
        safe.chainId === 1
          ? "1"
          : safe.chainId === 100
          ? "1500"
          : safe.chainId === 137
          ? "1000"
          : "1"
      setParams((prevParams) => {
        return { ...prevParams, bond: defaultAmount }
      })
    }
  }, [safe.chainId])

  // on change in params, recheck validation
  useEffect(() => {
    setValidFields({
      snapshotEns: validSnapshot,
      bond: !!params.bond,
    })
  }, [params, loadingEns, validSnapshot])

  const onParamChange = <Field extends keyof RealityModuleParams>(
    field: Field,
    value: RealityModuleParams[Field],
    valid?: boolean,
  ) => {
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
        executor: safe.safeAddress,
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
      const realityModuleAddress = deploymentRealityModuleTxsMm.meta
        ?.expectedModuleAddress as string
      // We can only batch the SafeSnap creation when Safe is controller + mainnet
      // Otherwise, just create the module, hope the user got the hint and opened Details
      // to figure out how to set up SafeSnap in the space themselves.
      if (isController && safe.chainId === 1) {
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
      // If monitoring enabled, try to setup monitoring
      if (openMonitoring) {
        const monitoringData: MonitoringSectionData = {
          // api and secret are required for button to be enabled
          apiKey: apiKey as string,
          secretKey: apiSecret as string,
          discordKey: discordKey ?? "",
          email: emails,
          slackKey: "",
          telegram: { botToken: telegramBotToken ?? "", chatID: telegramChatId ?? "" },
        }
        await setUpMonitoring(
          safe.chainId,
          realityModuleAddress,
          args.oracle,
          monitoringData,
        )
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

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="Kleros Reality Module"
      description="Deploy the Reality Module, automatically setting up Kleros as the arbitrator."
      icon="reality"
      tags={["Stackable", "From Kleros"]}
      onAdd={handleAddRealityModule}
      hideButton={true}
      readMoreLink="https://kleros.gitbook.io/docs/integrations/types-of-integrations/1.-dispute-resolution-integration-plan/channel-partners/kleros-reality-module"
    >
      {step === "form" ? (
        <>
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
                    {loadingEns ? (
                      <Box className={classes.loadingContainer}>
                        <Loader size="sm" className={classes.spinner} />
                      </Box>
                    ) : loadedEns && validEns ? (
                      <Box className={classes.loadingContainer}>
                        <CheckmarkIcon className={classes.spinner} />
                      </Box>
                    ) : null}
                  </>
                }
              />
              {!loadingEns && loadedEns && !validSnapshot && (
                <PropStatus
                  message="This Snapshot space does not exist."
                  status="error"
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1">Configure Monitoring</Typography>
            </Grid>
            <Grid
              xs={6}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div />
              <CustomSwitch
                value={openMonitoring}
                onClick={() => {
                  setOpenMonitoring(!openMonitoring)
                }}
              />
            </Grid>
          </Grid>
          {openMonitoring && (
            <Grid container direction="column" spacing={2} className={classes.fields}>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Setting up an effective monitoring strategy is critical for the security
                  of your safe. First, you need to{" "}
                  <Link
                    className={classes.linkStyle}
                    underline="always"
                    href="https://defender.openzeppelin.com/#/auth/sign-in"
                    target="_blank"
                  >
                    create an Open Zeppelin account
                  </Link>
                  .
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ZodiacTextField
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value)
                  }}
                  label="API Key"
                  placeholder="3pwZzZZZzzZZZzzZZzZZZAAaaAAaaZZzz"
                />
              </Grid>

              <Grid item xs={12}>
                <ZodiacTextField
                  value={apiSecret}
                  onChange={(e) => {
                    setApiSecret(e.target.value)
                  }}
                  label="API Secret"
                  placeholder="2LUwZwwuUuuUUzzZZdDddooodudDDdaaDDdaAAAddDDadDzZZzdDDdcCCdDDaaAA"
                />
              </Grid>
              {/* Emails section */}
              <Grid item xs={12}>
                <Grid item style={{ display: "flex" }}>
                  <Typography>Email</Typography>
                  <Typography style={{ fontStyle: "italic", opacity: "0.7" }}>
                    &nbsp;(optional)
                  </Typography>
                </Grid>
                <Typography variant="body2">
                  Add as many email addresses as you need
                </Typography>
                <ZodiacTextField
                  placeholder="john@doe.com"
                  value={currentEmail}
                  onChange={(e) => {
                    setCurrentEmail(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && emailIsValid) {
                      setEmails([...emails, currentEmail])
                      setCurrentEmail("")
                    }
                  }}
                  rightIcon={
                    <>
                      {emailIsValid ? (
                        <Box className={classes.loadingContainer}>
                          <Icon size="sm" type="add" color="primary" />
                        </Box>
                      ) : null}
                    </>
                  }
                />
                {emails && emails.map((e) => <Typography key={e}>{e}</Typography>)}
              </Grid>

              <Grid item xs={12}>
                <Grid item style={{ display: "flex" }}>
                  <Typography>Discord Integration</Typography>
                  <Typography style={{ fontStyle: "italic", opacity: "0.7" }}>
                    &nbsp;(optional)
                  </Typography>
                </Grid>
                <Grid
                  container
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">
                    Include the Discord channel's url key
                  </Typography>
                  <Link
                    className={classes.linkStyle}
                    href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
                    target="_blank"
                  >
                    Learn more
                  </Link>
                </Grid>
                <ZodiacTextField
                  value={discordKey}
                  onChange={(e) => {
                    setDiscordKey(e.target.value)
                  }}
                  placeholder="https://discord.com/api/webhooks/.../"
                />
              </Grid>

              <Grid item xs={12}>
                <Grid item style={{ display: "flex" }}>
                  <Typography>Telegram Integration</Typography>
                  <Typography style={{ fontStyle: "italic", opacity: "0.7" }}>
                    &nbsp;(optional)
                  </Typography>
                </Grid>
                <Grid
                  container
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">
                    Include the Telegram bot token and Chat ID
                  </Typography>
                  <Link
                    className={classes.linkStyle}
                    href="https://core.telegram.org/bots#6-botfather"
                    target={"_blank"}
                  >
                    Learn more
                  </Link>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <ZodiacTextField
                        placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                        value={telegramBotToken}
                        onChange={(e) => {
                          setTelegramBotToken(e.target.value)
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <ZodiacTextField
                        placeholder="1234567890"
                        value={telegramChatId}
                        onChange={(e) => {
                          setTelegramChatId(e.target.value)
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/* Button Section */}
          <ActionButton
            fullWidth
            startIcon={<ArrowUpIcon />}
            onClick={() => {
              setStep("confirm")
            }}
            disabled={!canConfirm}
            style={{ marginTop: "16px" }}
          >
            Add Module
          </ActionButton>
        </>
      ) : (
        <>
          <Typography>It's almost ready! Just a reminder:</Typography>
          {loadedEns &&
            (validSnapshot ? (
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
                <div style={{ marginTop: "4px" }}>
                  <PropStatus
                    message="Install SafeSnap after creating the module."
                    link="https://kleros.gitbook.io/docs/integrations/types-of-integrations/1.-dispute-resolution-integration-plan/channel-partners/kleros-reality-module#safesnap"
                    status="warning"
                  />
                </div>
              )
            ) : (
              <PropStatus message="This Snapshot space does not exist." status="error" />
            ))}
          {loadedEns && daorequirements === "" && (
            // Notice on how to setup DAO requirements, which appear on template.
            <PropStatus
              message="Missing DAO requirements ENS record."
              link="https://kleros.gitbook.io/docs/integrations/types-of-integrations/1.-dispute-resolution-integration-plan/channel-partners/kleros-reality-module#missing-daorequirements"
              status="warning"
            />
          )}
          <Grid
            container
            spacing={2}
            style={{ display: "flex", flexDirection: "row", marginTop: "16px" }}
          >
            <Grid item xs={6}>
              <ActionButton
                fullWidth
                startIcon={<ArrowUpIcon style={{ rotate: "270deg" }} />}
                onClick={() => setStep("form")}
              >
                Return
              </ActionButton>
            </Grid>
            <Grid item xs={6}>
              <ActionButton
                fullWidth
                startIcon={<ArrowUpIcon />}
                onClick={() => {
                  handleAddRealityModule()
                }}
              >
                Add Module
              </ActionButton>
            </Grid>
          </Grid>
        </>
      )}
    </AddModuleModal>
  )
}
