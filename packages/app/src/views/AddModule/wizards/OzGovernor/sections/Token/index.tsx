import React, { ChangeEvent, Fragment, useEffect, useState } from 'react'
import {
  Button,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core'

import { colors, ZodiacPaper, ZodiacTextField } from 'zodiac-ui-components'
import { ethers, isAddress } from 'ethers'
import { GovernorWizardProps } from '../..'
import { isVotesCompilable } from '../../service/tokenValidation'
import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    padding: theme.spacing(2),
  },
  radio: {
    marginLeft: -2,
    padding: 2,
    '& ~ .MuiFormControlLabel-label': {
      fontSize: 12,
      marginLeft: 4,
    },
    '&$checked': {
      color: colors.tan[1000],
    },
  },
  checked: {},
  errorColor: {
    color: 'rgba(244, 67, 54, 1)',
  },
  input: {
    '& .MuiInputBase-root': {
      borderColor: colors.tan[300],
      '&::before': {
        borderColor: colors.tan[300],
      },
    },
  },
  inputError: {
    '& .MuiInputBase-root': {
      borderColor: 'rgba(244, 67, 54, 0.3)',
      background: 'rgba(244, 67, 54, 0.1)',
      '&::before': {
        borderColor: 'rgba(244, 67, 54, 0.3)',
      },
    },
  },
}))

export type TokenFields =
  | 'tokenAddress'
  | 'tokenName'
  | 'tokenSymbol'
  | 'initialAmount'
  | 'tokenConfiguration'

export type TokenConfigurationType = 'existingToken' | 'ERC20' | 'ERC721'

export type TokenSectionData = {
  tokenAddress: string | undefined
  tokenName: string
  tokenSymbol: string
  initialAmount: number
  tokenConfiguration: TokenConfigurationType
}

export const TOKEN_INITIAL_VALUES: TokenSectionData = {
  tokenAddress: undefined,
  tokenName: '',
  tokenSymbol: '',
  initialAmount: 100000,
  tokenConfiguration: 'existingToken',
}

export const TokenSection: React.FC<GovernorWizardProps> = ({
  handleNext,
  handleBack,
  setupData,
}) => {
  const classes = useStyles()
  const token = setupData.token
  const [tokenData, setTokenData] = useState<TokenSectionData>(token)
  const [isValidTokenAddress, setIsValidTokenAddress] = useState<boolean>(false)

  const { provider } = useSafeAppsSDKWithProvider()
  const tokenAddressValidator = isVotesCompilable(provider)
  const { tokenAddress, tokenName, tokenSymbol, tokenConfiguration, initialAmount } = tokenData

  const collectSectionData = (): TokenSectionData => ({
    tokenAddress,
    tokenName,
    tokenSymbol,
    tokenConfiguration,
    initialAmount,
  })

  const handleInputClasses = () => {
    if ([tokenAddress].includes('')) {
      return classes.input
    }
    if (![tokenAddress].includes('' || undefined) && !isValidTokenAddress) {
      return classes.inputError
    }
    return classes.input
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTokenData({
      ...tokenData,
      tokenConfiguration: (event.target as HTMLInputElement).value as TokenConfigurationType,
    })
  }

  const updateFields = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: TokenFields,
  ) => {
    setTokenData({ ...tokenData, [fieldName]: event.target.value })
  }

  useEffect(() => {
    if (![tokenAddress].includes('' || undefined)) {
      const validations = async () => {
        if (
          isAddress(tokenAddress as string) &&
          (await tokenAddressValidator(tokenAddress as string))
        ) {
          setIsValidTokenAddress(true)
        } else {
          setIsValidTokenAddress(false)
        }
      }
      validations()
    }
  }, [tokenAddress, tokenAddressValidator])

  const handleValidation = (): boolean => {
    if (tokenConfiguration === 'existingToken') {
      return !isValidTokenAddress || [tokenAddress].includes('') ? true : false
    }
    if (tokenConfiguration === 'ERC721' || tokenConfiguration === 'ERC20') {
      return [tokenName, tokenSymbol].includes('') ? true : false
    }
    return true
  }

  const isValid = handleValidation()
  return (
    <ZodiacPaper
      borderStyle='single'
      className={classes.paperContainer}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Typography variant='h3'>Setup Token for Voting</Typography>
            </Grid>
            <Grid item>
              <Typography>
                The following token will enable members to vote on proposals with this governor
                contract. The token must be ERC20Votes compatible.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant='h4' color='textSecondary'>
            Token Configuration
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='body2'>
            Do you have an existing token in your safe that you&apos;d like to use as the token for
            voting in this contract?
          </Typography>
          <RadioGroup
            aria-label='Token Configuration'
            name='Token Configuration'
            value={tokenConfiguration}
            onChange={handleChange}
          >
            <FormControlLabel
              value='existingToken'
              control={
                <Radio
                  classes={{
                    root: classes.radio,
                    checked: classes.checked,
                  }}
                />
              }
              label='Existing Token'
            />
            <FormControlLabel
              value='ERC20'
              control={
                <Radio
                  classes={{
                    root: classes.radio,
                    checked: classes.checked,
                  }}
                />
              }
              label='Deploy a new ERC20 for voting.'
            />
            <FormControlLabel
              value='ERC721'
              control={
                <Radio
                  classes={{
                    root: classes.radio,
                    checked: classes.checked,
                  }}
                />
              }
              label='Deploy a new ERC721 for voting.'
            />
          </RadioGroup>
        </Grid>

        {tokenConfiguration === 'existingToken' && (
          <Grid item>
            <ZodiacTextField
              label='Token Address'
              value={tokenAddress}
              placeholder='0xDf33060F476511F806C72719394da1Ad64'
              borderStyle='double'
              className={handleInputClasses()}
              onChange={(e) => updateFields(e, 'tokenAddress')}
            />
            {![tokenAddress].includes('' || undefined) && !isValidTokenAddress && (
              <FormHelperText className={classes.errorColor}>
                Please provide a valid address
              </FormHelperText>
            )}
          </Grid>
        )}

        {(tokenConfiguration === 'ERC20' || tokenConfiguration === 'ERC721') && (
          <Fragment>
            <Grid item style={{ width: '-webkit-fill-available' }}>
              <Grid container spacing={2} justifyContent='space-between'>
                <Grid item xs={9}>
                  <ZodiacTextField
                    label='Token Name'
                    value={tokenName}
                    placeholder='MyToken'
                    borderStyle='double'
                    className={classes.input}
                    onChange={(e) => updateFields(e, 'tokenName')}
                    tooltipMsg='The same as collection name in OpenSea, e.g. Nouns'
                  />
                </Grid>
                <Grid item xs={3}>
                  <ZodiacTextField
                    label='Token Symbol'
                    value={tokenSymbol}
                    placeholder='TKN'
                    borderStyle='double'
                    className={classes.input}
                    onChange={(e) => updateFields(e, 'tokenSymbol')}
                    tooltipMsg='e.g. LOOT'
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* {tokenConfiguration === "ERC20" && (
              <Grid item>
                <ZodiacTextField
                  label="Initial Mint Amount"
                  value={initialAmount}
                  type="number"
                  placeholder="100000"
                  borderStyle="double"
                  className={classes.input}
                  onChange={(e) => updateFields(e, "initialAmount")}
                  tooltipMsg="The number of tokens you want to mint when the contract is deployed. These will be sent straight to the safe."
                />
              </Grid>
            )} */}
          </Fragment>
        )}

        <Grid item style={{ paddingBottom: 0 }}>
          <Divider />
        </Grid>
        <Grid item>
          <Grid container spacing={3} justifyContent='center' alignItems='center'>
            <Grid item>
              <Button size='medium' variant='text' onClick={() => handleBack(collectSectionData())}>
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                color='secondary'
                size='medium'
                variant='contained'
                disabled={isValid}
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
