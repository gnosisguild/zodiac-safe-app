/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, Grid, makeStyles, Typography } from "@material-ui/core"
import { CircleStep } from "components/CircleStep"
import React, { useState } from "react"
import { colors, ZodiacPaper } from "zodiac-ui-components"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
// import AddIcon from "@material-ui/icons/Add"
// import RemoveIcon from "@material-ui/icons/Remove"

// import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"

import { Loader } from "@gnosis.pm/safe-react-components"
import { GovernorSectionProps, SetupData } from "../.."

interface OZReviewSectionProps extends GovernorSectionProps {
  goToStep: (step: number) => void
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
  icon: {
    fill: "white",
    cursor: "pointer",
  },
  collapse: {
    textDecoration: "underline",
    cursor: "pointer",
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
    label: "Token",
    number: 1,
    section: 0,
  },
  {
    label: "Governor",
    number: 2,
    section: 1,
  },
]

export const OZReviewSection: React.FC<OZReviewSectionProps> = ({
  handleBack,
  handleNext,
  goToStep,
  setupData,
  loading,
}) => {
  const classes = useStyles()
  const [collapseSection, setCollapseSection] = useState<boolean>(false)
  const token = setupData?.token
  const governor = setupData?.governor

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        {!collapseSection && (
          <>
            <Grid item>
              <Grid container spacing={1} className={classes.container}>
                <Grid item>
                  <Typography variant="h3">Review</Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Divider />
            </Grid>

            {SECTIONS.map((item) => (
              <React.Fragment key={item.label}>
                <Grid item>
                  <CircleStep
                    label={item.label}
                    number={item.number}
                    disabled={loading || item.label === "Governor"}
                    onClick={() => goToStep(item.section)}
                  />
                </Grid>

                {item.label === "Token" && token && (
                  <Grid item>
                    <Typography>Voting token:</Typography>
                    <Typography>{token.tokenAddress}</Typography>
                  </Grid>
                )}
                {item.label === "Governor" && governor && (
                  <>
                    <Grid item>
                      <Typography>Name:</Typography>
                      <Typography>{governor.daoName}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Voting Delay:</Typography>
                      <Typography>{governor.votingDelay} block</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Voting Period:</Typography>
                      <Typography>{governor.votingPeriod} week</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Proposal Threshold:</Typography>
                      <Typography>{governor.proposalThreshold}%</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Quorum (%):</Typography>
                      <Typography>{governor.quorumPercent}%</Typography>
                    </Grid>
                  </>
                )}

                <Grid item>
                  <Divider />
                </Grid>
              </React.Fragment>
            ))}
          </>
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
                onClick={() => {
                  setCollapseSection(true)
                  handleNext(setupData)
                }}
              >
                Deploy and Enable Module
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  )
}

export default OZReviewSection
