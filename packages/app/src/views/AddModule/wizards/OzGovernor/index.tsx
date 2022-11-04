import React, { useState } from "react"
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
import { Link } from "components/text/Link"
import classnames from "classnames"
import { useRootDispatch } from "store"
import { setOzGovernorModuleScreen } from "store/modules"
import TokenSection, { TokenSectionData } from "../OzGovernor/sections/Token"

export interface GovernorSectionProps {
  handleNext: (stepData: TokenSectionData | any) => void
  handleBack: (stepData: TokenSectionData | any) => void
  setupData: SetupData | undefined
}

export type SetupData = {
  token: TokenSectionData
  governor: any
  review: any
}

const OZ_GOVERNOR_MODULE_STEPS: (keyof SetupData)[] = ["token", "governor", "review"]

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

export const OzGovernorModule: React.FC = () => {
  const classes = useStyles()
  const dispatch = useRootDispatch()
  const [activeStep, setActiveStep] = useState<number>(0)
  const [completed, setCompleted] = useState({
    token: false,
    governor: false,
    review: false,
  })
  // we can keep the user input data here. No need to send it anywhere else (no need for Redux here, this is self contained).
  const [setupData, setSetupData] = useState<SetupData>()

  const handleOpenSection = (pageToOpen: number, step: keyof SetupData) => {
    if (completed[step]) {
      setActiveStep(pageToOpen)
    }
  }

  const navigate = (nextPage: number, step: keyof SetupData, stepCompleted: boolean) => {
    return (stepData: any) => {
      setActiveStep(nextPage)
      setCompleted({ ...completed, [step]: stepCompleted })
      setSetupData({ ...setupData, [step]: stepData } as SetupData)
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.container}>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <BadgeIcon icon="ozGov" size={60} />
            </Grid>
            <Grid item style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5">Governor Module</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography gutterBottom>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.{" "}
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
                  Add Governor Module
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color="secondary"
                  size="medium"
                  variant="outlined"
                  onClick={() => dispatch(setOzGovernorModuleScreen(false))}
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
              {OZ_GOVERNOR_MODULE_STEPS.map((label, index) => (
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
                    {label === "token" && (
                      <TokenSection
                        handleNext={navigate(index + 1, label, true)}
                        handleBack={() => dispatch(setOzGovernorModuleScreen(false))}
                        setupData={setupData}
                      />
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
