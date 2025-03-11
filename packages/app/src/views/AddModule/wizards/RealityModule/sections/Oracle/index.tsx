import { Button, Divider, Grid, makeStyles, Typography } from '@material-ui/core'
import { Link } from 'components/text/Link'
import React, { useEffect, useState } from 'react'
import { ZodiacModal, ZodiacPaper } from 'zodiac-ui-components'
import OracleTemplate, {
  Data as OracleTemplateData,
  getDefaultTemplateQuestion,
} from './components/OracleTemplate'
import OracleInstance, { Data as OracleInstanceData } from './components/OracleInstance'
import OracleDelay, { Data as OracleDelayData } from './components/OracleDelay'
import OracleBond, { Data as OracleBondData, MIN_BOND } from './components/OracleBond'
import OracleArbitration, { Data as OracleArbitratorData } from './components/OracleArbitration'
import { SectionProps } from 'views/AddModule/wizards/RealityModule'
import { ARBITRATOR_OPTIONS } from 'services'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import { OracleAlert } from './components/OracleAlert'
import {
  DEFAULT_COOLDOWN,
  DEFAULT_EXPIRATION,
  DEFAULT_TIMEOUT,
  isValidOracleDelay,
  warningOracleDelay,
} from 'views/AddModule/wizards/RealityModule/utils/oracleValidations'
import { OracleDelayValidation } from './components/OracleDelayValidation'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },

  paperContainer: {
    padding: theme.spacing(2),
  },

  icon: {
    fill: 'white',
    width: '20px',
  },

  divider: {
    marginTop: 8,
    marginBottom: 8,
  },
  warningModal: {
    maxWidth: 650,
  },
  errorPaperContainer: {
    width: '100%',
    padding: theme.spacing(1),
    background: 'rgba(0, 0, 0, 0.2)',
    border: 0,
    borderRadius: 4,
    display: 'inline-block',
    '& .MuiTypography-root': {
      fontFamily: 'Roboto Mono',
    },
  },
}))

export const ORACLE_MAINNET_OPTIONS = [
  {
    label: 'ETH-0x5b7dD1E86623548AF054A4985F7fc8Ccbb554E2c',
    value: 'ETH-0x5b7dD1E86623548AF054A4985F7fc8Ccbb554E2c',
  },
  {
    label: 'GNO-0x33aa365a53a4c9ba777fb5f450901a8eef73f0a9',
    value: 'GNO-0x33aa365a53a4c9ba777fb5f450901a8eef73f0a9',
  },
  // { label: "Add Custom Instance", value: "custom" },
]

export const ORACLE_SEPOLIA_OPTIONS = [
  {
    label: 'ETH-0xaf33DcB6E8c5c4D9dDF579f53031b514d19449CA',
    value: 'ETH-0xaf33DcB6E8c5c4D9dDF579f53031b514d19449CA',
  },
  // { label: "Add Custom Instance", value: "custom" },
]

export interface InputPartProps {
  data: any
  setData: (data: any) => void
}

export type OracleSectionData = {
  templateData: OracleTemplateData
  instanceData: OracleInstanceData
  delayData: OracleDelayData
  bondData: OracleBondData
  arbitratorData: OracleArbitratorData
}

export const OracleSection: React.FC<SectionProps> = ({ handleBack, handleNext, setupData }) => {
  const classes = useStyles()
  const { safe } = useSafeAppsSDK()
  const options = safe.chainId === 1 ? ORACLE_MAINNET_OPTIONS : ORACLE_SEPOLIA_OPTIONS
  const [showModal, setShowModal] = useState<boolean>(false)
  if (setupData?.proposal.ensName == null) {
    throw new Error('ENS name is not set')
  }
  const [templateData, setTemplateData] = useState<OracleTemplateData>({
    templateType: 'default',
    language: 'english',
    category: 'DAO proposal',
    templateQuestion: getDefaultTemplateQuestion(setupData?.proposal.ensName),
  })

  const [instanceData, setInstanceData] = useState<OracleInstanceData>({
    instanceAddress: options[0].value.substr(options[0].value.indexOf('-') + 1),
    instanceType: options[0].value.substr(0, options[0].value.indexOf('-')) as
      | 'ETH'
      | 'GNO'
      | 'custom',
  })

  const [delayData, setDelayData] = useState<OracleDelayData>({
    timeout: DEFAULT_TIMEOUT,
    timeoutUnit: 'days',
    cooldown: DEFAULT_COOLDOWN,
    cooldownUnit: 'days',
    expiration: DEFAULT_EXPIRATION,
    expirationUnit: 'days',
  })

  const [bondData, setBondData] = useState<OracleBondData>({
    bond: 0.1,
  })

  const { timeout, cooldown, expiration } = delayData
  const { bond } = bondData
  const isValidTimeout = isValidOracleDelay('timeout', timeout)
  const isValidCooldown = isValidOracleDelay('cooldown', cooldown)
  const isValidExpiration = isValidOracleDelay('expiration', expiration, cooldown)
  const isWarningTimeout = warningOracleDelay('timeout', timeout)
  const isWarningCooldown = warningOracleDelay('cooldown', cooldown)
  const isWarningExpiration = warningOracleDelay('expiration', expiration)

  const [arbitratorData, setArbitratorData] = useState<OracleArbitratorData>({
    arbitratorOption: ARBITRATOR_OPTIONS.NO_ARBITRATOR,
  })

  const collectData = (): OracleSectionData => ({
    templateData,
    instanceData,
    delayData,
    bondData,
    arbitratorData,
  })

  const validateOracle = () => {
    if (
      [isWarningTimeout, isWarningCooldown, isWarningExpiration].includes(false) ||
      bond < MIN_BOND
    ) {
      return setShowModal(true)
    }
    handleNext(collectData())
  }

  useEffect(() => {
    if (setupData && setupData.oracle) {
      const { bondData, delayData, instanceData, templateData, arbitratorData } = setupData.oracle
      setBondData(bondData)
      setDelayData(delayData)
      setInstanceData(instanceData)
      setTemplateData(templateData)
      setArbitratorData(arbitratorData)
    }
  }, [setupData])

  if (setupData?.proposal.ensName == null) {
    throw new Error(
      'The ENS name is not available, it needs to already be in the setupData, before initiating this step.',
    )
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
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant='h3'>Set up the Oracle</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Now, it&apos;s time to set up the oracle for your reality module. The oracle ensures
                the results of proposals are brought accurately on-chain. The Reality.eth oracle
                uses a mechanism known as the{' '}
                <Link
                  underline='always'
                  href='https://reality.eth.limo/app/docs/html/whitepaper.html'
                  target={'_blank'}
                  color='inherit'
                >
                  escalation game
                </Link>{' '}
                to generate correct answers that can be used as inputs for smart contracts. The
                following parameters are very important for your DAO's security and should be
                considered carefully.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        <Grid item>
          <OracleTemplate
            data={templateData}
            setData={setTemplateData}
            ensName={setupData?.proposal.ensName}
          />
        </Grid>

        <Grid item>
          <OracleInstance data={instanceData} setData={setInstanceData} />
        </Grid>

        <Grid item>
          <OracleDelay data={delayData} setData={setDelayData} />
        </Grid>

        <Grid item>
          <OracleBond data={bondData} setData={setBondData} />
        </Grid>

        <Grid item>
          <OracleArbitration data={arbitratorData} setData={setArbitratorData} />
        </Grid>

        <Grid item style={{ paddingBottom: 0 }}>
          <Divider />
        </Grid>

        <Grid item>
          <Grid container spacing={3} justifyContent='center' alignItems='center'>
            <Grid item>
              <Button size='medium' variant='text' onClick={() => handleBack(collectData())}>
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                color='secondary'
                size='medium'
                variant='contained'
                disabled={[isValidTimeout, isValidCooldown, isValidExpiration].includes(false)}
                onClick={validateOracle}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <ZodiacModal
        className={classes.warningModal}
        open={showModal}
        isOpen={showModal}
        onClose={() => setShowModal(!showModal)}
        children={
          <Grid container spacing={1} direction='column'>
            <Grid item>
              <Grid container spacing={1} alignItems='center'>
                <Grid item>
                  <ErrorOutlineIcon className={classes.icon} />
                </Grid>
                <Grid item>
                  <Typography variant='h4'>Security Risk Detected</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Typography>
                The following security risks have been detected. We highly recommend that you
                resolve them before moving forward, as these can leave to loss of funds.
              </Typography>
            </Grid>

            <Grid item>
              <ZodiacPaper
                borderStyle='single'
                className={classes.errorPaperContainer}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <OracleDelayValidation type='timeout' delayValue={timeout} />
                <OracleDelayValidation type='cooldown' delayValue={cooldown} />
                <OracleDelayValidation
                  type='expiration'
                  delayValue={expiration}
                  dependsDelayValue={cooldown}
                />
                {bond < MIN_BOND && (
                  <Grid item>
                    <OracleAlert
                      type={'warning'}
                      message={'We highly recommend that your bond exceeds 0.1 ETH.'}
                    />
                  </Grid>
                )}
              </ZodiacPaper>
            </Grid>

            <Grid item className={classes.divider}>
              <Divider />
            </Grid>

            <Grid item>
              <Grid container alignItems='center' justifyContent='center' spacing={3}>
                <Grid item>
                  <Button size='medium' onClick={() => handleNext(collectData())}>
                    Proceed
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    color='secondary'
                    size='medium'
                    variant='contained'
                    onClick={() => setShowModal(false)}
                  >
                    Resolve (Recommended)
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
      />
    </ZodiacPaper>
  )
}

export default OracleSection
