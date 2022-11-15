import React, { ChangeEvent, useState } from "react"
import { Button, Divider, Grid, makeStyles, Typography } from "@material-ui/core"

import { colors, ZodiacPaper, ZodiacSlider, ZodiacTextField } from "zodiac-ui-components"
import { GovernorWizardProps } from "../.."

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

export type GovernorSectionData = {
  daoName: string
  votingDelayInBlocks: number
  votingPeriodInBlocks: number
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
  votingDelayInBlocks: 0,
  votingPeriodInBlocks: 50400,
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
    votingDelayInBlocks,
    votingPeriodInBlocks,
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
              <ZodiacTextField
                label="Voting Delay (in blocks)"
                value={votingDelayInBlocks}
                type="number"
                placeholder="0"
                borderStyle="double"
                className={classes.input}
                onChange={(event) => {
                  setGovernorData({
                    ...governorData,
                    votingDelayInBlocks: parseInt(event.target.value),
                  })
                }}
                tooltipMsg="The time between proposal submission and when voting starts."
              />
            </Grid>
            <Grid item xs={6}>
              <ZodiacTextField
                label="Voting Period (in blocks)"
                value={votingPeriodInBlocks}
                type="number"
                placeholder="50400"
                borderStyle="double"
                className={classes.input}
                onChange={(event) => {
                  setGovernorData({
                    ...governorData,
                    votingPeriodInBlocks: parseInt(event.target.value),
                  })
                }}
                tooltipMsg="The number of blocks between when a proposal's voting period starts and ends."
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
                Back
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
