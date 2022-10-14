import React, { useEffect, useState } from "react"
import { useRootDispatch, useRootSelector } from "store"
import {
  fetchPendingModules,
  setModuleAdded,
  setRealityModuleScreen,
} from "../../../../store/modules"
import { BadgeIcon, colors, ZodiacPaper } from "zodiac-ui-components"
import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core"
import { TagList } from "components/list/TagList"
import { Link } from "components/text/Link"
import OracleSection, { OracleSectionData } from "./sections/Oracle"
import ProposalSection, { ProposalSectionData } from "./sections/Proposal"
import ReviewSection from "./sections/Review"
import classnames from "classnames"
import MonitoringSection, { MonitoringSectionData } from "./sections/Monitoring"
import { setup } from "./service/setupService"
import { getProvider } from "services"
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"
import { getDelayModules, getModulesList } from "store/modules/selectors"

export interface SectionProps {
  handleNext: (
    stepData: ProposalSectionData | OracleSectionData | MonitoringSectionData | any,
  ) => void
  handleBack: () => void
  setupData: SetupData | undefined
}

export type SetupData = {
  proposal: ProposalSectionData
  oracle: OracleSectionData
  monitoring: MonitoringSectionData
  review: any
}

const REALITY_MODULE_STEPS: (keyof SetupData)[] = [
  "proposal",
  "oracle",
  "monitoring",
  "review",
] // TODO: Add monitoring

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1.5),
    overflowY: "auto",
  },
  container: {
    display: "flex",
    flexDirection: "column",
  },
  tag: {
    background: theme.palette.secondary.main,
  },
  paperContainer: {
    padding: theme.spacing(2),
  },
  paperTitle: {
    margin: 0,
  },
  step: {
    "& text": {
      fontFamily: "Roboto Mono",
    },
    "& .step-label": {
      textTransform: "capitalize",
      display: "inline",
      fontFamily: "Roboto Mono",
      "&.clickable": {
        cursor: "pointer",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  },
  stepperRoot: {
    backgroundColor: "transparent",
    border: "none",
    padding: theme.spacing(0),
    "& .MuiStepIcon-active": {
      color: theme.palette.secondary.main,
      border: `1px solid ${colors.tan[300]}`,
      borderRadius: "100%",
    },
    "& .MuiStepIcon-completed": {
      background: theme.palette.text.primary,
      border: `1px solid ${colors.tan[300]}`,
      borderRadius: "100%",
      color: theme.palette.secondary.main,
    },
    "& .Mui-disabled .MuiStepIcon-root": {
      color: theme.palette.primary.main,
      border: `1px solid ${colors.tan[300]}`,
      borderRadius: "100%",
    },
  },
}))

export const RealityModule: React.FC = () => {
  const classes = useStyles()
  const { sdk: safeSdk, safe: safeInfo } = useSafeAppsSDK()
  const delayModules = useRootSelector(getDelayModules)
  const dispatch = useRootDispatch()
  const modulesList = useRootSelector(getModulesList)
  const [modules, setModules] = useState<number>(modulesList.length)
  const [activeStep, setActiveStep] = useState<number>(2)
  const [completed, setCompleted] = useState({
    proposal: false,
    oracle: false,
    monitoring: false,
    review: false,
  })
  const [loading, setLoading] = useState<boolean>(false)
  // we can keep the user input data here. No need to send it anywhere else (no need for Redux here, this is self contained).
  const [setupData, setSetupData] = useState<SetupData>()

  const handleOpenSection = (pageToOpen: number, step: keyof SetupData) => {
    if (completed[step]) {
      setActiveStep(pageToOpen)
    }
  }

  const handleNext = (nextPage: number, step: keyof SetupData) => {
    return (stepData: any) => {
      setActiveStep(nextPage)
      setCompleted({ ...completed, [step]: true })
      setSetupData({ ...setupData, [step]: stepData } as SetupData)
    }
  }

  const handleBack = (nextPage: number, step: keyof SetupData) => {
    setActiveStep(nextPage)
    setCompleted({ ...completed, [step]: false })
  }

  const handleDone = async (delayModuleExecutor?: string) => {
    const provider = getProvider(safeInfo.chainId)
    setLoading(true)
    if (setupData == null) {
      setLoading(false)
      throw new Error("No setup data")
    }
    const executorAddress =
      delayModuleExecutor !== "" || delayModuleExecutor == null
        ? safeInfo.safeAddress
        : delayModuleExecutor
    try {
      await setup(provider, safeSdk, safeInfo, executorAddress, setupData)
      console.log("TODO: call the monitoring setup worker")
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
    dispatch(fetchPendingModules(safeInfo))
    dispatch(setModuleAdded(true))
  }

  useEffect(() => {
    if (loading && modulesList.length > modules) {
      setModules(modulesList.length)
      setLoading(false)
      dispatch(setRealityModuleScreen(false))
    }
  }, [dispatch, loading, modules, modulesList])

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.container}>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <BadgeIcon icon={"reality"} size={60} />
            </Grid>
            <Grid item>
              <Typography variant="h5">Reality Module</Typography>
              <TagList
                className={classes.tag}
                tags={["Stackable", "From Gnosis Guild"]}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography gutterBottom>
            Allows Reality.eth questions to execute a transaction when resolved.{" "}
            <Link
              underline="always"
              href="https://github.com/gnosis/zodiac-module-reality"
              target={"_blank"}
              color="inherit"
            >
              Read more here.
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              style={{ marginBottom: 15 }}
            >
              <Grid item>
                <Typography variant="h4" gutterBottom className={classes.paperTitle}>
                  Add Reality Module
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color="secondary"
                  size="medium"
                  variant="outlined"
                  onClick={() => dispatch(setRealityModuleScreen(false))}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <Stepper
              activeStep={activeStep}
              className={classes.stepperRoot}
              orientation="vertical"
            >
              {REALITY_MODULE_STEPS.map((label, index) => (
                <Step key={label} className={classes.step}>
                  <StepLabel
                    onClick={() => handleOpenSection(index, label as keyof SetupData)}
                  >
                    <Typography
                      variant="h6"
                      className={classnames(
                        index <= activeStep && "clickable",
                        "step-label",
                      )}
                    >
                      {label}
                    </Typography>{" "}
                  </StepLabel>
                  <StepContent>
                    {label === "proposal" && (
                      <ProposalSection
                        handleNext={handleNext(index + 1, label)}
                        handleBack={() => dispatch(setRealityModuleScreen(false))}
                        setupData={setupData}
                      />
                    )}
                    {label === "oracle" && (
                      <OracleSection
                        handleNext={handleNext(index + 1, label)}
                        handleBack={() => handleBack(activeStep - 1, label)}
                        setupData={setupData}
                      />
                    )}
                    {label === "monitoring" && (
                      <MonitoringSection
                        handleNext={handleNext(index + 1, label)}
                        handleBack={() => handleBack(activeStep - 1, label)}
                        setupData={setupData}
                      />
                    )}
                    {label === "review" && (
                      <>
                        <ReviewSection
                          handleNext={handleDone} // this is where we would execute the transactions!!
                          handleBack={() => handleBack(activeStep - 1, label)}
                          goToStep={setActiveStep}
                          setupData={setupData}
                          delayModules={delayModules}
                          loading={loading}
                        />
                      </>
                    )}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </ZodiacPaper>
        </Grid>
      </Grid>
    </div>
  )
}

export default RealityModule
