import React, { useEffect, useState } from "react"
import {
  Button,
  Divider,
  FormHelperText,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core"

import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components"
import { ethers } from "ethers"
import { GovernorWizardProps } from "../.."
import { isVotesCompilable } from "../../service/tokenValidation"
import useSafeAppsSDKWithProvider from "hooks/useSafeAppsSDKWithProvider"

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  paperContainer: {
    padding: theme.spacing(2),
  },

  errorColor: {
    color: "rgba(244, 67, 54, 1)",
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
}))

export type TokenSectionData = {
  tokenAddress: string
}

export const TokenSection: React.FC<GovernorWizardProps> = ({
  handleNext,
  handleBack,
  setupData,
}) => {
  const classes = useStyles()
  const [tokenAddress, setTokenAddress] = useState<string>(
    setupData?.token.tokenAddress ?? "",
  )
  const [isValidTokenAddress, setIsValidTokenAddress] = useState<boolean>(false)
  const { provider } = useSafeAppsSDKWithProvider()
  const tokenAddressValidator = isVotesCompilable(provider)

  const collectSectionData = (): TokenSectionData => ({
    tokenAddress,
  })

  const handleInputClasses = () => {
    if ([tokenAddress].includes("")) {
      return classes.input
    }
    if (![tokenAddress].includes("") && !isValidTokenAddress) {
      return classes.inputError
    }
    return classes.input
  }

  useEffect(() => {
    if (![tokenAddress].includes("")) {
      const validations = async () => {
        if (
          ethers.utils.isAddress(tokenAddress) &&
          (await tokenAddressValidator(tokenAddress))
        ) {
          setIsValidTokenAddress(true)
        } else {
          setIsValidTokenAddress(false)
        }
      }
      validations()
    }
  }, [tokenAddress, tokenAddressValidator])

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
                governor contract. The token must be ERC20Votes compatible.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <ZodiacTextField
            label="Token Address"
            value={tokenAddress}
            placeholder="0xDf33060F476511F806C72719394da1Ad64"
            borderStyle="double"
            className={handleInputClasses()}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          {![tokenAddress].includes("") && !isValidTokenAddress && (
            <FormHelperText className={classes.errorColor}>
              Please provide a valid address
            </FormHelperText>
          )}
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
                disabled={!isValidTokenAddress || [tokenAddress].includes("")}
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

export default TokenSection
