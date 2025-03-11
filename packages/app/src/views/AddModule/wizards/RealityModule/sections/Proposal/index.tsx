/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Divider,
  Grid,
  makeStyles,
  // FormControlLabel,
  // Radio,
  // RadioGroup,
  Typography,
} from '@material-ui/core'

import { Link } from 'components/text/Link'
import React, { useEffect, useMemo, useState } from 'react'
// import useSpace from "services/snapshot/hooks/useSpace"
import { checkIfIsController, checkIfIsOwner } from 'services/ens'
import { SectionProps } from 'views/AddModule/wizards/RealityModule'
import { colors, ZodiacPaper, ZodiacTextField } from 'zodiac-ui-components'
import ProposalStatus from './components/ProposalStatus'
import * as snapshot from 'services/snapshot'
import { handleProposalStatus, handleProposalStatusMessage } from 'utils/proposalValidation'
import { Loader } from '@gnosis.pm/safe-react-components'
import DoneIcon from '@material-ui/icons/Done'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import useSafeAppsSDKWithProvider from 'hooks/useSafeAppsSDKWithProvider'
import { safeAppUrl } from 'utils/url'
import { NETWORK } from 'utils/networks'
import useEns from 'hooks/useEns'
import useDebouncedState from 'hooks/useDebouncedState'
import { getAddressRecord } from '@ensdomains/ensjs/public'
import { InfuraProvider } from 'ethers'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  paperContainer: {
    padding: theme.spacing(2),
  },

  doneIcon: {
    marginRight: 4,
    fill: '#A8E07E',
    width: '16px',
  },
  errorIcon: {
    marginRight: 4,
    fill: 'rgba(244, 67, 54, 1)',
    width: '16px',
  },

  loadingContainer: {
    marginRight: 4,
    padding: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    height: 14,
    width: 14,
    border: `1px solid ${colors.tan[300]}`,
  },
  spinner: {
    width: '8px !important',
    height: '8px !important',
    color: `${colors.tan[300]} !important`,
  },
  loading: {
    width: '15px !important',
    height: '15px !important',
    marginRight: 8,
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
  textSubdued: {
    color: 'rgba(255 255 255 / 70%)',
  },
  textFieldSmall: {
    '& .MuiFormLabel-root': {
      fontSize: 12,
    },
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
  errorContainer: { margin: 8, display: 'flex', alignItems: 'center' },
}))

export type ProposalSectionData = {
  // proposalType: "snapshot" | "custom";
  ensName: string
}

export const ProposalSection: React.FC<SectionProps> = ({ handleNext, handleBack, setupData }) => {
  const { ensClient } = useEns()
  const { safe, provider } = useSafeAppsSDKWithProvider()
  const classes = useStyles()
  const [ensName, debouncedEnsName, setEnsName] = useDebouncedState('')
  const [ensAddress, setEnsAddress] = useState<string>('')
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isSafesnapInstalled, setIsSafesnapInstalled] = useState<boolean>(false)
  const [isController, setIsController] = useState<boolean>(false)
  const [hasSnapshot, setHasSnapshot] = useState<boolean>(false)
  const [validSnapshot, setValidSnapshot] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [ensIsValid, setEnsIsValid] = useState<boolean>(false)
  
  // hack to resolve mainnet ENS
  const mainnetProvider = useMemo(() => new InfuraProvider(NETWORK.MAINNET, import.meta.env.VITE_INFURA_ID), [])
  const sepoliaProvider = useMemo(() => new InfuraProvider(NETWORK.SEPOLIA, import.meta.env.VITE_INFURA_ID), [])

  useEffect(() => {
    if (provider && setupData && setupData.proposal) {
      setEnsName(setupData.proposal.ensName)
    }
  }, [])

  useEffect(() => {
    const checkEns = async () => {
      if (debouncedEnsName && ensClient) {
        const ensSubgraphRecord = await ensClient.getSubgraphRecords({ name: debouncedEnsName })
        if (ensSubgraphRecord) {
          setEnsIsValid(true)
          setLoading(true)
          const validateInfo = async () => {
            await validEns()
          }
          validateInfo()
        } else {
          setEnsIsValid(false)
          setIsController(false)
          setIsOwner(false)
        }
      }
    }
    checkEns()
  }, [debouncedEnsName, ensClient, mainnetProvider, sepoliaProvider])

  const validEns = async () => {
    if (!ensClient) return
    const record = await getAddressRecord(ensClient, { name: debouncedEnsName })
    const address = record?.value
    if (address) {
      const snapshotSpace = await snapshot.getSnapshotSpaceSettings(ensName, safe.chainId)
      console.log(snapshotSpace)
      // const snapshotSpaceValidation = snapshot.validateSchema(snapshotSpace)
      const isOwner = await checkIfIsOwner(ensClient, ensName, safe.safeAddress)
      const isController = await checkIfIsController(mainnetProvider, sepoliaProvider, ensClient, ensName, safe.safeAddress)
      const plugins = snapshotSpace?.plugins
      if (plugins) {
        setIsSafesnapInstalled(plugins.safeSnap ? true : false) // comment out for easy testing
      }
      // if (snapshotSpaceValidation !== true) {
      //   console.log('The current snapshot space is not valid. Valid snapshot space schema. Errors:')
      //   console.log(JSON.stringify(snapshot.validateSchema(snapshotSpace), undefined, 2))
      // }
      setHasSnapshot(snapshotSpace ? true : false)
      // setValidSnapshot(snapshotSpaceValidation === true)
      setIsOwner(isOwner)
      setIsController(isController)
      setEnsAddress(address)
      setLoading(false)
      return
    } else {
      setEnsAddress('')
      setLoading(false)
      setIsOwner(false)
      setIsController(false)
      setHasSnapshot(false)
      setValidSnapshot(false)
      setIsSafesnapInstalled(false)
      return
    }
  }

  const collectSectionData = (): ProposalSectionData => ({
    // proposalType,
    ensName,
  })

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setProposalType(
  //     (event.target as HTMLInputElement).value as "snapshot" | "custom"
  //   );
  // };

  const handleEns = (ens: string) => {
    if (ens === '') {
      setIsController(false)
      setIsOwner(false)
      setHasSnapshot(false)
      setValidSnapshot(false)
      setEnsName('')
    } else {
      setEnsName(ens)
    }
  }

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
              <Typography variant='h3'>Configure Proposal Space</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Add your preferred proposal type below to get started. If you&apos;re unsure, we
                recommend starting with Snapshot.
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                Don&apos;t have a snapshot space setup yet?{` `}
                <Link
                  underline='always'
                  href={safeAppUrl(safe, `https://snapshot.org/#/setup?step=1`)}
                  target={'_blank'}
                  color='inherit'
                >
                  Get started here.
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
              <Typography variant='h4' color='textSecondary'>
                Proposal Configuration
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='body2' className={classes.textSubdued}>
                Enter your snapshot space ENS domain below to get started. The Safe must be the
                controller of this ENS domain.
              </Typography>
            </Grid>
            {/* For now we're only use snapshot space */}
            {/* <Grid item>
              <Typography variant="body2">
                Select your proposal type:
              </Typography>
              <RadioGroup
                aria-label="proposal type"
                name="proposalType"
                value={proposalType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="snapshot"
                  control={
                    <Radio
                      classes={{
                        root: classes.radio,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label="Snapshot"
                />
                <FormControlLabel
                  disabled={true}
                  value="custom"
                  control={
                    <Radio
                      classes={{
                        root: classes.radio,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label="Custom"
                />
              </RadioGroup>
            </Grid> */}
            <Grid item>
              <ZodiacTextField
                value={ensName}
                onChange={({ target }) => handleEns(target.value)}
                label='Enter the Snapshot ENS name.'
                placeholder='ex: gnosis.eth'
                borderStyle='double'
                className={`${classes.textFieldSmall} ${
                  ensName.includes('.eth') &&
                  !loading &&
                  (!hasSnapshot || !isController || !isOwner)
                    ? classes.inputError
                    : classes.input
                }`}
                rightIcon={
                  <>
                    {loading && (
                      <Box className={classes.loadingContainer}>
                        <Loader size='sm' className={classes.spinner} />
                      </Box>
                    )}
                    {ensName.includes('.eth') &&
                      !loading &&
                      (!hasSnapshot || !isController || !isOwner) && (
                        <ErrorOutlineIcon className={classes.errorIcon} />
                      )}
                    {ensName.includes('.eth') &&
                      !loading &&
                      hasSnapshot &&
                      isController &&
                      isOwner && <DoneIcon className={classes.doneIcon} />}
                  </>
                }
              />
              <br />
              <br />

              {ensIsValid && (
                <>
                  <ProposalStatus
                    type='snapshot'
                    status={handleProposalStatus(
                      'snapshot',
                      loading,
                      false,
                      false,
                      hasSnapshot,
                      validSnapshot,
                      false,
                    )}
                    message={handleProposalStatusMessage(
                      'snapshot',
                      false,
                      false,
                      hasSnapshot,
                      validSnapshot,
                      false,
                    )}
                  />
                  <ProposalStatus
                    type='safesnap'
                    status={handleProposalStatus(
                      'safesnap',
                      loading,
                      false,
                      false,
                      false,
                      false,
                      isSafesnapInstalled,
                    )}
                    message={handleProposalStatusMessage(
                      'safesnap',
                      false,
                      false,
                      false,
                      false,
                      isSafesnapInstalled,
                    )}
                  />
                  <ProposalStatus
                    type='controller'
                    status={handleProposalStatus(
                      'controller',
                      loading,
                      isController,
                      false,
                      false,
                      false,
                      false,
                    )}
                    message={handleProposalStatusMessage(
                      'controller',
                      isController,
                      false,
                      false,
                      false,
                      false,
                    )}
                  />
                  <ProposalStatus
                    type='owner'
                    status={handleProposalStatus(
                      'owner',
                      loading,
                      false,
                      isOwner,
                      false,
                      false,
                      false,
                    )}
                    message={handleProposalStatusMessage(
                      'owner',
                      false,
                      isOwner,
                      false,
                      false,
                      false,
                    )}
                    address={ensAddress}
                  />
                  {/* {ensAddress && !isOwner && handleProposalStatus("owner") === "error" && (
                    <Grid item>
                      <DangerAlert
                        msg={
                          "The connected safe does not own the ENS name that you've entered. The owner of the ENS name has unilateral control of the ENS name (for instance, the owner can change the controller and the ENS records at any time)."
                        }
                        address={ensAddress}
                      />
                    </Grid>
                  )} */}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
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
                disabled={!isController || isSafesnapInstalled}
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

export default ProposalSection
