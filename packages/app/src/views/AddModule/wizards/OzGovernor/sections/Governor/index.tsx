import React, { useState } from "react"
import { Button, Divider, Grid, makeStyles, Slider, Typography } from "@material-ui/core"

import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components"
import { GovernorSectionProps } from "../.."
import { TimeSelect } from "components/input/TimeSelect"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  paperContainer: {
    padding: theme.spacing(2),
  },

  doneIcon: {
    marginRight: 4,
    fill: "#A8E07E",
    width: "16px",
  },
  errorIcon: {
    marginRight: 4,
    fill: "rgba(244, 67, 54, 1)",
    width: "16px",
  },
  errorColor: {
    color: "rgba(244, 67, 54, 1)",
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
  loading: {
    width: "15px !important",
    height: "15px !important",
    marginRight: 6,
  },
  radio: {
    marginLeft: -2,
    padding: 2,
    "& ~ .MuiFormControlLabel-label": {
      fontSize: 12,
      marginLeft: 4,
    },
    "&$checked": {
      color: colors.tan[1000],
    },
  },
  checked: {},
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
  textFieldSmall: {
    "& .MuiFormLabel-root": {
      fontSize: 12,
    },
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
  errorContainer: { margin: 8, display: "flex", alignItems: "center" },
}))

export type GovernorSectionData = {
  daoName: string
}

export const GovernorSection: React.FC<GovernorSectionProps> = ({
  handleNext,
  handleBack,
  setupData,
}) => {
  const classes = useStyles()
  const [daoName, setDaoName] = useState<string>(setupData?.governor?.daoName ?? "")

  const collectSectionData = (): GovernorSectionData => ({
    daoName,
  })

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Setup OZ Governor Contract</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Configure your governor contract. It can always be changed later, so
                don&apos;t worry too much about getting it perfect the first time.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ZodiacTextField
            label="DAO Name:"
            value={daoName}
            placeholder="My Governor"
            borderStyle="double"
            className={classes.input}
            onChange={(e) => setDaoName(e.target.value)}
          />
        </Grid>

        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Voting Delay Configurations
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" className={classes.textSubdued}>
                Configure a delay modifier to determine the duration required before
                voting (Cooldown), and the amount of time that the proposal will be valid
                (Expiration).
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={6}>
              <TimeSelect
                variant={"secondary"}
                label="Cooldown"
                tooltipMsg="The time between proposal submission and when voting starts."
                // valueUnit={get("cooldownUnit")}
                // value={cooldown}
                onChange={(value, unit) => {
                  console.log("value", value)
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimeSelect
                variant={"secondary"}
                label="Expiration"
                tooltipMsg="The time between proposal when voting starts and ends."
                onChange={(value, unit) => {
                  console.log("value", value)
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h4" color="textSecondary">
                Voting Thresholds
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ZodiacTextField
            label="Proposal Threshold"
            color="secondary"
            borderStyle="double"
            className={classes.input}
            tooltipMsg="How many tokens must someone own before they can submit a proposal to the DAO?"
          />
        </Grid>

        <Grid item>
          <Slider aria-labelledby="continuous-slider" />
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
                onClick={() => handleBack(collectSectionData())}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="medium"
                variant="contained"
                onClick={() => handleNext(collectSectionData())}
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

export default GovernorSection
