import { Button, Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { MultiSelect, MultiSelectValues } from "components/MultiSelect"
import { Link } from "components/text/Link"
import usePrevious from "hooks/usePrevious"
import React, { ChangeEvent, useEffect, useState } from "react"
import { SectionProps } from "views/AddModule/wizards/RealityModule"
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components"
import { useMonitoringValidation } from "../../hooks/useMonitoringValidation"
import { MonitoringStatus } from "./components/MonitoringStatus"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },

  paperContainer: {
    padding: theme.spacing(2),
  },

  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
  inputContainer: {
    width: "50%",
  },
  input: {
    "& .MuiInputBase-root": {
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
  inputError: {
    "& .MuiInputBase-root": {
      borderColor: "rgba(244, 67, 54, 0.3)",
      background: "rgba(244, 67, 54, 0.1)",
      "&::before": {
        borderColor: "rgba(244, 67, 54, 0.3)",
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
  spinner: {
    width: "8px !important",
    height: "8px !important",
    color: `${colors.tan[300]} !important`,
  },
}))

export interface MonitoringSectionData {
  apiKey: string
  secretKey: string
  email: string[]
  discordKey: string
  telegram: { botToken: string; chatID: string }
  slackKey: string
}

const INITIAL_DATA: MonitoringSectionData = {
  apiKey: "",
  secretKey: "",
  email: [],
  discordKey: "",
  telegram: {
    botToken: "",
    chatID: "",
  },
  slackKey: "",
}

export const MonitoringSection: React.FC<SectionProps> = ({
  handleBack,
  handleNext,
  setupData,
}) => {
  const classes = useStyles()
  const {
    loading,
    execute: validateCredentials,
    error: invalidCredentials,
  } = useMonitoringValidation()
  const monitoring = setupData?.monitoring
  const [monitoringData, setMonitoringData] = useState<MonitoringSectionData>(
    monitoring ?? INITIAL_DATA,
  )
  const [emailValues, setEmailValues] = useState<MultiSelectValues[]>([])
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false)
  const [loadValidations, setLoadValidations] = useState<boolean>(false)

  const { apiKey, secretKey, email, discordKey, slackKey, telegram } = monitoringData
  const previousApiKey = usePrevious(apiKey)
  const previousSecretKey = usePrevious(secretKey)

  useEffect(() => {
    if (monitoring && monitoring.email.length) {
      const emails: MultiSelectValues[] = []
      monitoring.email.forEach((item: string) =>
        emails.push({ label: item, value: item }),
      )
      setEmailValues(emails)
    }
  }, [monitoring])

  useEffect(() => {
    if (!loading && ![apiKey, secretKey].includes("") && !loadValidations) {
      setLoadValidations(true)
      const executeValidations = async () => {
        await validateCredentials(apiKey, secretKey)
      }
      executeValidations()
    }
  }, [apiKey, secretKey, loading, loadValidations, validateCredentials])

  useEffect(() => {
    if (
      (previousApiKey !== apiKey || previousSecretKey !== secretKey) &&
      loadValidations
    ) {
      setLoadValidations(false)
    }
  }, [apiKey, secretKey, previousApiKey, previousSecretKey, loadValidations])

  const updateForm = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string,
  ) => {
    event.preventDefault()
    if (["chatID", "botToken"].includes(fieldName)) {
      const telegram = { ...monitoringData.telegram }
      const newValues = { ...telegram, [fieldName]: event.target.value }
      setMonitoringData({
        ...monitoringData,
        telegram: newValues,
      })
      return
    }
    setMonitoringData({ ...monitoringData, [fieldName]: event.target.value })
  }

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleNewEmail = async (value: MultiSelectValues[]) => {
    const list: string[] = []
    let invalid = false
    value.forEach((item: MultiSelectValues) => {
      if (isValidEmail(item.value)) {
        list.push(item.value)
        setInvalidEmail(false)
        invalid = false
        return
      }
      invalid = true
      setInvalidEmail(true)
    })
    if (!value.length) {
      setEmailValues(value)
      return
    }
    if (!invalid) {
      setEmailValues(value)
      setMonitoringData({ ...monitoringData, email: list })
      return
    }
  }

  const handleStatusMessage = (): string | null => {
    if (loading) return "Validating API credentials..."
    if (invalidCredentials)
      return "The API credentials that you have provided are not valid. Please verify that you have the correct information."
    if (!invalidCredentials && typeof invalidCredentials === "boolean")
      return "API credentials are valid."
    return null
  }

  const handleStatus = (): "loading" | "error" | "success" | null => {
    if (loading) return "loading"
    if (invalidCredentials) return "error"
    if (!invalidCredentials && typeof invalidCredentials === "boolean") return "success"
    return null
  }

  const isInvalidForm = (): boolean => {
    const { botToken, chatID } = telegram
    if (loading || invalidCredentials) {
      return true
    }
    if ((botToken === "" && chatID !== "") || (botToken !== "" && chatID === "")) {
      return true
    }
    if (
      botToken === "" &&
      chatID === "" &&
      discordKey === "" &&
      slackKey === "" &&
      email.length === 0
    ) {
      return true
    }
    return false
  }

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Configure Monitoring</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Setting up an effective monitoring strategy is critical for the security
                of your safe. In order to set up the monitoring for this module,
                you&apos;ll need to first{" "}
                <Link
                  underline="always"
                  href="https://defender.openzeppelin.com/#/auth/sign-in"
                  target={"_blank"}
                  color="inherit"
                >
                  create an Open Zeppelin account.
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                API Configuration
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Include the API Key and Secret Key from your Open Zeppelin account below.
                Follow the Open Zeppelin guide {""}
                <Link
                  underline="always"
                  href="https://docs.openzeppelin.com/defender/guide-factory#generate-api-key"
                  target={"_blank"}
                  color="inherit"
                >
                  here.
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <ZodiacTextField
                label="API Key"
                placeholder="0f9u8yuiahkjdh8qhiflahfjajdhafa"
                borderStyle="double"
                value={monitoringData.apiKey}
                onChange={(e) => updateForm(e, "apiKey")}
                className={invalidCredentials ? classes.inputError : classes.input}
              />
            </Grid>
            <Grid item>
              <ZodiacTextField
                label="API Secret"
                placeholder="hkjdh8qhiflahfjajdhafa0f9u8yuiahkjdh8qhiflahfjajdhafa"
                value={monitoringData.secretKey}
                onChange={(e) => updateForm(e, "secretKey")}
                borderStyle="double"
                className={invalidCredentials ? classes.inputError : classes.input}
              />
            </Grid>
            <Grid item>
              <MonitoringStatus status={handleStatus()} message={handleStatusMessage()} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Email
              </Typography>
            </Grid>
            <Grid item>
              <Typography>Add as many emails as you&apos;d like.</Typography>
            </Grid>
            <Grid item>
              <MultiSelect
                invalidText={invalidEmail ? "Please provide a valid email" : undefined}
                onChange={(values) => handleNewEmail(values as MultiSelectValues[])}
                value={emailValues}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Discord
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                To add a Discord integration, include the Discord channel&apos;s url
                including key below. Find out more{" "}
                <Link
                  underline="always"
                  href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks"
                  target={"_blank"}
                  color="inherit"
                >
                  here.
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <ZodiacTextField
                label="Discord Key"
                placeholder="key"
                borderStyle="double"
                className={classes.input}
                value={monitoringData.discordKey}
                onChange={(e) => updateForm(e, "discordKey")}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Telegram
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                To add a Telegram integration, include the telegram bot token and chat ID
                below. Find out more{" "}
                <Link
                  underline="always"
                  href="https://core.telegram.org/bots#6-botfather"
                  target={"_blank"}
                  color="inherit"
                >
                  here.
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Grid
                container
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item className={classes.inputContainer}>
                  <ZodiacTextField
                    label="Bot token"
                    placeholder="abc"
                    borderStyle="double"
                    className={classes.input}
                    value={monitoringData.telegram.botToken}
                    onChange={(e) => updateForm(e, "botToken")}
                  />
                </Grid>
                <Grid item className={classes.inputContainer}>
                  <ZodiacTextField
                    label="Chat ID"
                    placeholder="123"
                    borderStyle="double"
                    className={classes.input}
                    value={monitoringData.telegram.chatID}
                    onChange={(e) => updateForm(e, "chatID")}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Slack
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                To add a Slack integration, include the Slack channel&apos;s url including
                key below. Find out more{" "}
                <Link
                  underline="always"
                  href="https://docs.openzeppelin.com/defender/sentinel#notifications"
                  target={"_blank"}
                  color="inherit"
                >
                  here.
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <ZodiacTextField
                label="Slack Channel URL"
                placeholder="https://slack.com/url/key"
                borderStyle="double"
                className={classes.input}
                value={monitoringData.slackKey}
                onChange={(e) => updateForm(e, "slackKey")}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item style={{ paddingBottom: 0 }}>
          <Divider />
        </Grid>

        <Grid item>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item>
              <Button
                size="medium"
                variant="text"
                onClick={() => handleBack(monitoringData)}
              >
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="medium"
                variant="contained"
                type="submit"
                disabled={isInvalidForm()}
                onClick={() => handleNext(monitoringData)}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  )
}

export default MonitoringSection
