import {
  Button,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { CircleStep } from "components/circleStep/CircleStep";
import React, { useState } from "react";
import { colors, ZodiacPaper } from "zodiac-ui-components";

interface ReviewSectionProps {
  handleNext: () => void;
  handleBack: () => void;
  goToStep: (step: number) => void;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },

  paperContainer: {
    padding: theme.spacing(2),
  },

  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
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
}));

const SECTIONS = [
  {
    label: "Proposal",
    number: 1,
    section: 0,
  },
  {
    label: "Oracle",
    number: 2,
    section: 1,
  },
  {
    label: "Monitoring",
    number: 3,
    section: 2,
  },
];

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  handleBack,
  handleNext,
  goToStep,
}) => {
  const classes = useStyles();

  return (
    <ZodiacPaper borderStyle='single' className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant='h3'>Review</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Here is an overview of your reality module configuration. Please
                review carefully. Once you’ve confirmed that the details are
                correct, you can submit the transaction which will add the
                reality module to this safe, and automatically integrate the
                SafeSnap plugin with the snapshot space you’ve include.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        {SECTIONS.map((item) => (
          <>
            <Grid item>
              <CircleStep
                label={item.label}
                number={item.number}
                onClick={() => goToStep(item.section)}
              />
            </Grid>

            {item.label === "Proposal" && (
              <Grid item>
                <Typography>Snapshot Space:</Typography>
                <Link
                  color='inherit'
                  href='https://snapshot.com/#/weenus.eth/'
                  target='_blank'>
                  snapshot.com/#/weenus.eth
                </Link>
              </Grid>
            )}

            <Grid item>
              <Divider />
            </Grid>
          </>
        ))}

        <Grid item>
          <Grid
            container
            spacing={3}
            justifyContent='center'
            alignItems='center'>
            <Grid item>
              <Button size='medium' variant='text' onClick={handleBack}>
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                color='secondary'
                size='medium'
                variant='contained'
                onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  );
};
