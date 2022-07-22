import React from "react";
import { useRootDispatch } from "store";
import { setRealityModuleScreen } from "../../store/modules";
import { BadgeIcon, ZodiacPaper } from "zodiac-ui-components";
import {
  Button,
  Divider,
  Grid,
  Link,
  makeStyles,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { TagList } from "components/list/TagList";
import { MonitoringSection } from "./sections/MonitoringSection";
import { OracleSection } from "./sections/OracleSection";
import { ProposalSection } from "./sections/ProposalSection";
import { ReviewSection } from "./sections/ReviewSection";

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
  stepperRoot: {
    "& .MuiStepIcon-active": {
      color: theme.palette.secondary.main,
      border: "1px solid rgba(217, 212, 173, 0.3)",
      borderRadius: "100%",
    },
    "& .MuiStepIcon-completed": {
      background: "rgba(217, 212, 173, 0.3)",
      color: theme.palette.secondary.main,
      border: "1px solid rgba(217, 212, 173, 0.3)",
      borderRadius: "100%",
    },
    "& .Mui-disabled .MuiStepIcon-root": {
      color: theme.palette.primary.main,
      border: "1px solid rgba(217, 212, 173, 0.3)",
      borderRadius: "100%",
    },
  },
}));

const REALITY_MODULE_STEPS = ["Proposal", "Oracle", "Monitoring", "Review"];

export const RealityModule: React.FC = () => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const [activeStep, setActiveStep] = React.useState(0);

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} className={classes.container}>
        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <BadgeIcon icon={"reality"} size={60} />
            </Grid>
            <Grid item>
              <Typography variant='h5'>Reality Module</Typography>
              <TagList className={classes.tag} tags={["Stackable", "From Gnosis Guild"]} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography gutterBottom>
            Allows Reality.eth questions to execute a transaction when resolved.{" "}
            <Link
              underline='always'
              href='https://github.com/gnosis/zodiac-module-reality'
              target={"_blank"}
              color='inherit'>
              Read more here.
            </Link>
          </Typography>
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <ZodiacPaper borderStyle='single' className={classes.paperContainer}>
            <Grid container justifyContent='space-between' alignItems='center' style={{ marginBottom: 15 }}>
              <Grid item>
                <Typography variant='h4' gutterBottom className={classes.paperTitle}>
                  Add Reality Module
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color='secondary'
                  size='medium'
                  variant='outlined'
                  onClick={() => dispatch(setRealityModuleScreen(false))}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
            <Stepper activeStep={activeStep} className={classes.stepperRoot} orientation='vertical'>
              {REALITY_MODULE_STEPS.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography variant='h6'>{label}</Typography>{" "}
                  </StepLabel>
                  <StepContent>
                    {label === "Proposal" && <ProposalSection handleNext={() => setActiveStep(activeStep + 1)} />}
                    {label === "Oracle" && <OracleSection />}
                    {label === "Monitoring" && <MonitoringSection />}
                    {label === "Review" && <ReviewSection />}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </ZodiacPaper>
        </Grid>
      </Grid>
    </div>
  );
};
