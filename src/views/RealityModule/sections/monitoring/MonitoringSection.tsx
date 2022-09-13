import { Button, Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { MultiSelect, MultiSelectValues } from "components/multiSelect/MultiSelect"
import { Link } from "components/text/Link"
import React, { ChangeEvent, useEffect, useState } from "react"
import { SectionProps } from "views/RealityModule/RealityModule"
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components"

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

export const MonitoringSection: React.FC<SectionProps> = ({ handleBack, handleNext, setupData }) => {
  const classes = useStyles()
  const monitoring = setupData?.monitoring
  const [monitoringData, setMonitoringData] = useState<MonitoringSectionData>(monitoring ?? INITIAL_DATA)
  const [emailValues, setEmailValues] = useState<MultiSelectValues[]>([])

  useEffect(() => {
    if (monitoring && monitoring.email.length) {
      const emails: MultiSelectValues[] = []
      monitoring.email.forEach((item: string) => emails.push({ label: item, value: item }))
      setEmailValues(emails)
    }
  }, [monitoring])

  const updateForm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, fieldName: string) => {
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

  const handleNewEmail = async (value: MultiSelectValues[]) => {
    const list = value.map((item: MultiSelectValues) => item.value)
    setEmailValues(value)
    setMonitoringData({ ...monitoringData, email: list })
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
                Setting up an effective monitoring strategy is critical for the security of your safe. In order to set
                up the monitoring for this module, you&apos;ll need to first{" "}
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
                Include the API Key and Secret Key from your Open Zeppelin account below. Follow the Open Zeppelin guide{" "}
                {""}
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
                className={classes.input}
              />
            </Grid>
            <Grid item>
              <ZodiacTextField
                label="API Secret"
                placeholder="hkjdh8qhiflahfjajdhafa0f9u8yuiahkjdh8qhiflahfjajdhafa"
                value={monitoringData.secretKey}
                onChange={(e) => updateForm(e, "secretKey")}
                borderStyle="double"
                className={classes.input}
              />
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
              <MultiSelect onChange={(values) => handleNewEmail(values as MultiSelectValues[])} value={emailValues} />
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
                To add a Discord integration, include the Discord channel&apos;s url including key below. Find out more{" "}
                <Link underline="always" href="" target={"_blank"} color="inherit">
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
                To add a Telegram integration, include the telegram bot token and chat ID below. Find out more{" "}
                <Link underline="always" href="" target={"_blank"} color="inherit">
                  here.
                </Link>
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2} direction="row" alignItems="center" justifyContent="space-between">
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
                To add a Slack integration, include the Slack channel&apos;s url including key below. Find out more{" "}
                <Link underline="always" href="" target={"_blank"} color="inherit">
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
              <Button size="medium" variant="text" onClick={handleBack}>
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button color="secondary" size="medium" variant="contained" onClick={() => handleNext(monitoringData)}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  )
}
