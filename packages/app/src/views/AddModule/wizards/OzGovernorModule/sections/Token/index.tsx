/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Divider, Grid, makeStyles, Typography } from "@material-ui/core"

import React, { useEffect } from "react"

import { SectionProps } from "views/AddModule/wizards/RealityModule"
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components"

import useSafeAppsSDKWithProvider from "hooks/useSafeAppsSDKWithProvider"
import { fetchSafeBalanceInfo } from "services"

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
    marginRight: 8,
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

export type TokenSectionData = {
  token: string
}

export const TokenSection: React.FC<SectionProps> = ({
  handleNext,
  handleBack,
  setupData,
}) => {
  const { safe, provider, sdk } = useSafeAppsSDKWithProvider()
  const classes = useStyles()
  console.log("sdk", sdk)

  useEffect(() => {
    const getSafeInfo = async () => {
      await fetchSafeBalanceInfo(safe.chainId, safe.safeAddress).then((res) =>
        console.log("res", res),
      )
    }
    getSafeInfo()
  }, [])

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Setup Token for Voting</Typography>
            </Grid>
            <Grid item>
              <Typography>
                The following token will enable members to vote on proposals with this
                governor contract.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>{/* <Divider /> */}</Grid>

        <Grid item style={{ paddingBottom: 0 }}>
          <Divider />
        </Grid>
        <Grid item>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item>
              <Button
                size="medium"
                variant="text"
                // onClick={() => handleBack()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="medium"
                variant="contained"
                // disabled={!isController || isSafesnapInstalled}
                // onClick={() => handleNext(collectSectionData())}
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

export default TokenSection
