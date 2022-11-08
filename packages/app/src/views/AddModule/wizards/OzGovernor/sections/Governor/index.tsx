import React, { ChangeEvent, useState } from "react"
import { Button, Divider, Grid, makeStyles, Typography } from "@material-ui/core"

import { colors, ZodiacPaper, ZodiacSlider, ZodiacTextField } from "zodiac-ui-components"
import { GovernorWizardProps } from "../.."
import { TimeSelect, unitConversion } from "components/input/TimeSelect"

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
  input: {
    "& .MuiInputBase-root": {
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
}))

type Unit = keyof typeof unitConversion

export type GovernorSectionData = {
  daoName: string
  votingDelay: number
  votingDelayUnit: Unit
  votingPeriod: number
  votingPeriodUnit: Unit
  proposalThreshold: number
  quorumPercent: number
}

type GovernorFields =
  | "daoName"
  | "votingDelay"
  | "votingPeriod"
  | "proposalThreshold"
  | "quorumPercent"

export const GOVERNOR_INITIAL_VALUES: GovernorSectionData = {
  daoName: "",
  votingDelay: 0,
  votingDelayUnit: "days",
  votingPeriod: 604800,
  votingPeriodUnit: "days",
  proposalThreshold: 0,
  quorumPercent: 4,
}

export const GovernorSection: React.FC<GovernorWizardProps> = ({
  handleNext,
  handleBack,
  setupData,
}) => {
  const classes = useStyles()
  const governor = setupData.governor
  const [governorData, setGovernorData] = useState<GovernorSectionData>(governor)

  const updateFields = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: GovernorFields,
  ) => {
    setGovernorData({ ...governorData, [fieldName]: event.target.value })
  }

  const collectSectionData = (): GovernorSectionData => governorData
  const {
    daoName,
    votingDelay,
    votingDelayUnit,
    votingPeriod,
    votingPeriodUnit,
    proposalThreshold,
    quorumPercent,
  } = governorData

  const nextValidations = (): boolean => {
    if (![daoName].includes("") && quorumPercent >= 0 && quorumPercent <= 100) {
      return false
    }
    return true
  }
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
            onChange={(e) => updateFields(e, "daoName")}
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
                valueUnit={votingDelayUnit}
                value={votingDelay.toString()}
                onChange={(value, unit) => {
                  setGovernorData({
                    ...governorData,
                    votingDelay: parseInt(value),
                    votingDelayUnit: unit,
                  })
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimeSelect
                variant={"secondary"}
                label="Expiration"
                tooltipMsg="The time between proposal when voting starts and ends."
                valueUnit={votingPeriodUnit}
                value={votingPeriod.toString()}
                onChange={(value, unit) => {
                  setGovernorData({
                    ...governorData,
                    votingPeriod: parseInt(value),
                    votingPeriodUnit: unit,
                  })
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
            type="number"
            value={proposalThreshold}
            tooltipMsg="How many tokens must someone own before they can submit a proposal to the DAO?"
            onChange={(e) => updateFields(e, "proposalThreshold")}
          />
        </Grid>
        <Grid item>
          <ZodiacSlider
            label="Quorum (%):"
            defaultValue={quorumPercent}
            hasInput
            onChangeSlider={(value) => {
              if (typeof value === "number" && quorumPercent !== value && value >= 0) {
                setGovernorData({
                  ...governorData,
                  quorumPercent: value,
                })
              }
            }}
          />
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
                disabled={nextValidations()}
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
