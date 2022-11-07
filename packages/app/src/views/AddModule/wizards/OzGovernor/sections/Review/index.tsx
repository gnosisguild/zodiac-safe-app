/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, Grid, Link, makeStyles, Typography } from "@material-ui/core"
import { CircleStep } from "components/CircleStep"
import React from "react"
import { colors, ZodiacPaper } from "zodiac-ui-components"
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward"
import { Loader } from "@gnosis.pm/safe-react-components"
import { GovernorSectionProps, SetupData } from "../.."
import { BigNumber } from "ethers"
import { unitConversion } from "components/input/TimeSelect"

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

  icon: {
    fill: "white",
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
  label: {
    fontFamily: "Roboto Mono, monospace",
    fontSize: 12,
    fontWeight: "bold",
  },
  loading: {
    width: "15px !important",
    height: "15px !important",
  },
  value: {
    fontFamily: "Roboto Mono, monospace",
    fontWeight: "bold",
  },
  underline: {
    textDecoration: "underline",
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
  const token = setupData?.token
  const governor = setupData?.governor

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={3} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Review</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Please take a final look at your OZ Governor Module details.
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
                <Link
                  href={`https://goerli.etherscan.io/token/${token.tokenAddress}`} // TO DO: Replace with real network address
                  className={classes.value}
                >
                  {token.tokenAddress}
                </Link>
              </Grid>
            )}
            {item.label === "Governor" && governor && (
              <>
                <Grid item>
                  <Typography>Name:</Typography>
                  <Typography className={classes.value}>{governor.daoName}</Typography>
                </Grid>
                <Grid item>
                  <Typography>Voting Delay:</Typography>
                  <Typography className={classes.value}>
                    {governor.votingDelay} days
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Voting Period:</Typography>
                  <Typography className={classes.value}>
                    {BigNumber.from(governor.votingPeriod)
                      .div(unitConversion["days"])
                      .toString()}{" "}
                    days
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Proposal Threshold:</Typography>
                  <Typography className={classes.value}>
                    {governor.proposalThreshold}%
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>Quorum (%):</Typography>
                  <Typography className={classes.value}>
                    {governor.quorumPercent}%
                  </Typography>
                </Grid>
              </>
            )}

            <Grid item>
              <Divider />
            </Grid>
          </React.Fragment>
        ))}

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
