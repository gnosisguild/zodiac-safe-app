import {
  Button,
  Divider,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { CircleStep } from "components/circleStep/CircleStep";
import React from "react";
import { colors, ZodiacPaper } from "zodiac-ui-components";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

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

  paperTemplateContainer: {
    marginTop: 4,
    padding: theme.spacing(2),
    background: "rgba(0, 0, 0, 0.2)",
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
  link: {
    fontFamily: "Roboto Mono",
    fontSize: 12,
    textDecoration: "underline",
    fontWeight: "bold",
  },
  label: {
    fontFamily: "Roboto Mono",
    fontSize: 12,
    fontWeight: "bold",
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
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Review</Typography>
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
                  color="inherit"
                  href="https://snapshot.com/#/weenus.eth/"
                  target="_blank"
                  className={classes.link}
                >
                  snapshot.com/#/weenus.eth
                </Link>
              </Grid>
            )}

            {item.label === "Oracle" && (
              <Grid item>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <Typography>Template question preview:</Typography>
                    <ZodiacPaper className={classes.paperTemplateContainer}>
                      <Typography>
                        Did the Snapshot proposal with the id %s in the
                        weenus.eth space pass the execution of the array of
                        Module transactions that have the hash 0x%s and does it
                        meet the requirements of the document referenced in the
                        dao requirements record at weenust.eth? The hash is the
                        keccak of the concatenation of the individual EIP-712
                        hashes of the Module transactions. If this question was
                        asked before the corresponding Snapshot proposal was
                        resolved, it should ALWAYS be resolved to INVALID!
                      </Typography>
                    </ZodiacPaper>
                  </Grid>
                  <Grid item>
                    <Typography>Oracle Address:</Typography>
                    <Link
                      color="inherit"
                      href="https://rinkeby.etherscan.io/search?f=0&q=0xDf33060F476511F806C72719394da1Ad64"
                      target="_blank"
                      className={classes.link}
                    >
                      0xDf33060F476511F806C72719394da1Ad64
                    </Link>
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      spacing={1}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Grid item>
                        <Typography>Timeout:</Typography>
                        <Typography className={classes.label}>
                          24 hours
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Cooldown:</Typography>
                        <Typography className={classes.label}>
                          24 hours
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Expiration:</Typography>
                        <Typography className={classes.label}>
                          24 hours
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>Bond:</Typography>
                        <Typography className={classes.label}>
                          0.1 ETH
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Typography>Oracle Address:</Typography>
                    <Link
                      color="inherit"
                      href="https://reality.eth/proposal/343293804ji32khfgahfa "
                      target="_blank"
                      className={classes.link}
                    >
                      https://reality.eth/proposal/343293804ji32khfgahfa
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            )}

            {item.label === "Monitoring" && (
              <Grid item>
                <Typography>Monitoring:</Typography>
                <Link
                  color="inherit"
                  href="https://tenderly.com/#/3290ihfdajka"
                  target="_blank"
                  className={classes.link}
                >
                  tenderly.com/#/3290ihfdajka
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
                startIcon={<ArrowUpwardIcon />}
                onClick={handleNext}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ZodiacPaper>
  );
};