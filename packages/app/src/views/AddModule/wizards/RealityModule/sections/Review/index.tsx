/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, Grid, Link, makeStyles, Typography } from "@material-ui/core"
import { CircleStep } from "components/CircleStep"
import React, { useEffect, useState } from "react"
import { colors, ZodiacPaper } from "zodiac-ui-components"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import { SectionProps, SetupData } from "views/AddModule/wizards/RealityModule"
import { DelayModule, ModuleType } from "store/modules/models"
import { AttachModuleForm } from "views/AddModule/wizards/components/AttachModuleForm"
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { OracleSectionData } from "../Oracle"
import { Loader } from "@gnosis.pm/safe-react-components"
import { BigNumber } from "ethers"
import { unitConversion } from "components/input/TimeSelect"
import { EXPLORERS_CONFIG } from "utils/explorers"
import { NETWORK } from "utils/networks"
import { getSnapshotSpaceUrl } from "services/snapshot"

interface ReviewSectionProps extends SectionProps {
  goToStep: (step: number) => void
  delayModules: DelayModule[]
  setupData: SetupData | undefined
  loading: boolean
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },

  paperContainer: {
    padding: theme.spacing(2),
  },

  paperTemplateContainer: {
    marginTop: 4,
    padding: theme.spacing(2),
    background: "rgba(0, 0, 0, 0.2)",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },

  input: {
    "& .MuiInputBase-root": {
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
  textarea: {
    "& .MuiInputBase-root": {
      padding: theme.spacing(2),
      background: "rgba(0, 0, 0, 0.2)",
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
  link: {
    fontFamily: "Roboto Mono",
    fontSize: 12,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  label: {
    fontFamily: "Roboto Mono",
    fontSize: 12,
    fontWeight: "bold",
  },
  loading: {
    width: "15px !important",
    height: "15px !important",
  },
}))

const SECTIONS = [
  {
    label: "Proposal",
    number: 1,
    section: 0,
  },
  {
    label: "Oracle",
    number: 2,
    section: 1,
  },
  {
    label: "Monitoring",
    number: 3,
    section: 2,
  },
]

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  handleBack,
  handleNext,
  goToStep,
  delayModules,
  setupData,
  loading,
}) => {
  const classes = useStyles()
  const { safe } = useSafeAppsSDK()
  const [snapshopSpace, setSnapshotSpace] = useState<string>()
  const [oracleData, setOracleData] = useState<OracleSectionData | undefined>(undefined)
  const [delayModule, setDelayModule] = useState<string>(
    delayModules.length === 1 ? delayModules[0].address : "",
  )
  const monitoring = setupData && setupData.monitoring

  useEffect(() => {
    if (setupData && setupData.proposal) {
      setSnapshotSpace(getSnapshotSpaceUrl(safe.chainId, setupData.proposal.ensName))
    }
    if (setupData && setupData.oracle) {
      setOracleData(setupData.oracle)
    }
  }, [setupData])

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Review</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Here is an overview of your reality module configuration. Please review
                carefully. Once you&apos;ve confirmed that the details are correct, you
                can submit the transaction which will add the reality module to this safe,
                and automatically integrate the SafeSnap plugin with the snapshot space
                you&apos;ve include.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        {SECTIONS.map((item) => (
          <>
            <Grid item>
              <CircleStep
                label={item.label}
                number={item.number}
                disabled={loading}
                onClick={() => goToStep(item.section)}
              />
            </Grid>

            {item.label === "Proposal" && (
              <Grid item>
                <Typography>Snapshot Space:</Typography>
                <Link
                  color="inherit"
                  href={snapshopSpace}
                  target="_blank"
                  className={classes.link}
                >
                  {snapshopSpace}
                </Link>
              </Grid>
            )}

            {item.label === "Oracle" && oracleData && setupData && (
              <Grid item>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography>Template question preview:</Typography>
                    <ZodiacPaper className={classes.paperTemplateContainer}>
                      <Typography>
                        Did the Snapshot proposal with the id %s in the
                        {setupData.proposal.ensName} space pass the execution of the array
                        of Module transactions that have the hash 0x%s and does it meet
                        the requirements of the document referenced in the dao
                        requirements record at {setupData.proposal.ensName}? The hash is
                        the keccak of the concatenation of the individual EIP-712 hashes
                        of the Module transactions. If this question was asked before the
                        corresponding Snapshot proposal was resolved, it should ALWAYS be
                        resolved to INVALID!
                      </Typography>
                    </ZodiacPaper>
                  </Grid>
                  <Grid item>
                    <Typography>Oracle Address:</Typography>
                    <Link
                      color="inherit"
                      href={`${EXPLORERS_CONFIG[safe.chainId as NETWORK]}/search?f=0&q=${
                        oracleData.instanceData.instanceAddress
                      }`}
                      target="_blank"
                      className={classes.link}
                    >
                      {oracleData.instanceData.instanceAddress}
                    </Link>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      spacing={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Grid item>
                        <Typography>Timeout:</Typography>
                        <Typography className={classes.label}>
                          {BigNumber.from(oracleData.delayData.timeout)
                            .div(unitConversion[oracleData.delayData.timeoutUnit])
                            .toString()}{" "}
                          {oracleData.delayData.timeoutUnit}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Cooldown:</Typography>
                        <Typography className={classes.label}>
                          {BigNumber.from(oracleData.delayData.cooldown)
                            .div(unitConversion[oracleData.delayData.cooldownUnit])
                            .toString()}{" "}
                          {oracleData.delayData.cooldownUnit}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Expiration:</Typography>
                        <Typography className={classes.label}>
                          {BigNumber.from(oracleData.delayData.expiration)
                            .div(unitConversion[oracleData.delayData.expirationUnit])
                            .toString()}{" "}
                          {oracleData.delayData.expirationUnit}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Bond:</Typography>
                        <Typography className={classes.label}>
                          {oracleData.bondData.bond} ETH
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography>Arbitrator:</Typography>
                    <Typography className={classes.label}>
                      {oracleData.arbitratorData.arbitratorOption === 0 &&
                        "No arbitration (highest bond wins)"}
                      {oracleData.arbitratorData.arbitratorOption === 1 && "Kleros"}
                    </Typography>
                  </Grid>
                  {/* <Grid item>
                    <Typography>Oracle Address:</Typography>
                    <Link
                      color='inherit'
                      href='https://reality.eth/proposal/343293804ji32khfgahfa '
                      target='_blank'
                      className={classes.link}>
                      https://reality.eth/proposal/343293804ji32khfgahfa
                    </Link>
                  </Grid> */}
                </Grid>
              </Grid>
            )}

            {item.label === "Monitoring" && monitoring && (
              <Grid item>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography>API key/secret:</Typography>
                    <Typography className={classes.label}>Valid</Typography>
                  </Grid>
                  {monitoring.email.length > 0 && (
                    <Grid item>
                      <Typography>Emails:</Typography>
                      {monitoring.email.map((email, index) => (
                        <Typography className={classes.label} key={index}>
                          - {email}
                        </Typography>
                      ))}
                    </Grid>
                  )}
                  {monitoring.discordKey !== "" && (
                    <Grid item>
                      <Typography>Discord:</Typography>
                      <Typography className={classes.label}>
                        {monitoring.discordKey}
                      </Typography>
                    </Grid>
                  )}
                  {monitoring.telegram.botToken !== "" && (
                    <Grid item>
                      <Typography>Telegram:</Typography>
                      <Typography className={classes.label}>
                        Bot token: {monitoring.telegram.botToken}
                      </Typography>
                      <Typography className={classes.label}>
                        Chat ID: {monitoring.telegram.chatID}
                      </Typography>
                    </Grid>
                  )}
                  {monitoring.slackKey !== "" && (
                    <Grid item>
                      <Typography>Slack:</Typography>
                      <Typography className={classes.label}>
                        {monitoring.slackKey}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}

            <Grid item>
              <Divider />
            </Grid>
          </>
        ))}

        {delayModules.length >= 1 && (
          <Grid item>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              <Grid item>
                <Typography variant="h6" gutterBottom>
                  Deploy Options
                </Typography>
                <AttachModuleForm
                  description={executionModuleDescription}
                  modules={delayModules}
                  value={delayModule}
                  onChange={(value: string) => setDelayModule(value)}
                  type={ModuleType.DELAY}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item>
              <Button
                size="medium"
                variant="text"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="medium"
                variant="contained"
                startIcon={
                  loading ? (
                    <Loader className={classes.loading} size="sm" color="background" />
                  ) : (
                    <ArrowUpwardIcon />
                  )
                }
                disabled={loading}
                onClick={handleNext}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  )
}

const executionModuleDescription = (
  <Typography variant="body2">
    This will add a time delay to any transactions created by this module.{" "}
    <b>Note that this delay is cumulative with the cooldown set above</b> (e.g. if both
    are set to 24 hours, the cumulative delay before the transaction can be executed will
    be 48 hours).
  </Typography>
)

export default ReviewSection
