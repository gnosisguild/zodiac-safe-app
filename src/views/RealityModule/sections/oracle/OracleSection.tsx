import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Link } from "components/text/Link";
import React from "react";
import { ZodiacPaper } from "zodiac-ui-components";
import { OracleTemplate } from "./components/oracleTemplate/OracleTemplate";
import { OracleInstance } from "./components/oracleInstance/OracleInstance";
import { OracleDelay } from "./components/oracleDelay/OracleDelay";
import { OracleBond } from "./components/oracleBond/OracleBond";
import { OracleArbitration } from "./components/oracleArbitration/OracleArbitration";

interface OracleSectionProps {
  handleNext: () => void;
  handleBack: () => void;
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },

  paperContainer: {
    padding: theme.spacing(2),
  },
}));

export const OracleSection: React.FC<OracleSectionProps> = ({
  handleBack,
  handleNext,
}) => {
  const classes = useStyles();

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Set up the Oracle</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Now, it&apos;s time to set up the oracle for your reality
                module. The oracle ensures the results of proposals are brought
                accurately on-chain. The Reality.eth oracle uses a mechanism
                known as the{" "}
                <Link
                  underline="always"
                  href="https://snapshot.com"
                  target={"_blank"}
                  color="inherit"
                >
                  escalation game
                </Link>{" "}
                to generate correct answers that can be used as inputs for smart
                contracts. The following parameters are very important for your
                DAO's security and should be considered carefully.
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Divider />
        </Grid>

        <Grid item>
          <OracleTemplate />
        </Grid>

        <Grid item>
          <OracleInstance />
        </Grid>

        <Grid item>
          <OracleDelay />
        </Grid>

        <Grid item>
          <OracleBond />
        </Grid>

        <Grid item>
          <OracleArbitration />
        </Grid>

        <Grid item style={{ paddingBottom: 0 }}>
          <Divider />
        </Grid>

        <Grid item>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Button size="medium" variant="text" onClick={handleBack}>
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="secondary"
                size="medium"
                variant="contained"
                onClick={handleNext}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  );
};
