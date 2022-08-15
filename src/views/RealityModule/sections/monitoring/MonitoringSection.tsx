import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Dropdown } from "components/dropdown/Dropdown";
import { Link } from "components/text/Link";
import React, { useState } from "react";
import { SectionProps } from "views/RealityModule/RealityModule";
import { colors, ZodiacPaper, ZodiacTextField } from "zodiac-ui-components";
interface MonitoringSectionProps {
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

export const MonitoringSection: React.FC<SectionProps> = ({
  handleBack,
  handleNext,
}) => {
  const classes = useStyles();

  const [monitoringService, setMonitoringService] = useState<string>("default");
  const [param1, setParam1] = useState<string>("");
  const [param2, setParam2] = useState<string>("");
  const [param3, setParam3] = useState<string>("");

  const [customParams, setCustomParams] = useState({});

  return (
    <ZodiacPaper borderStyle="single" className={classes.paperContainer}>
      <Grid container spacing={4} className={classes.container}>
        <Grid item>
          <Grid container spacing={1} className={classes.container}>
            <Grid item>
              <Typography variant="h3">Configure Monitoring</Typography>
            </Grid>
            <Grid item>
              <Typography>
                Setting up an effective monitoring strategy is critical for the
                security of your safe. Gnosis is providing you with a free,
                baseline monitoring service via{" "}
                <Link
                  underline="always"
                  href="https://tenderly.co/monitoring/"
                  target={"_blank"}
                  color="inherit"
                >
                  Tenderly.
                </Link>{" "}
                However, if you&apos;d prefer to setup your monitoring with a
                different service, select the Custom monitoring option.
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
              <Grid container spacing={1} className={classes.container}>
                <Grid item>
                  <Typography variant="h4" color="textSecondary">
                    Monitoring Service
                  </Typography>
                </Grid>
                <Grid item>
                  <Dropdown
                    value={monitoringService}
                    options={[
                      { label: "Tenderly (default)", value: "default" },
                      { label: "Custom", value: "custom" },
                    ]}
                    disableUnderline
                    label="Select your monitoring service:"
                    onChange={(evt) =>
                      setMonitoringService(evt.target.value as string)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} className={classes.container}>
            <Grid item>
              <Grid container spacing={1} className={classes.container}>
                <Grid item>
                  <Typography variant="h4" color="textSecondary">
                    Monitoring Configuration
                  </Typography>
                </Grid>
                {monitoringService === "default" && (
                  <Grid item>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <ZodiacTextField
                          label="Parameter 1"
                          borderStyle="double"
                          tooltipMsg="..."
                          className={classes.input}
                          onChange={(evt) => setParam1(evt.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <ZodiacTextField
                          label="Parameter 2"
                          borderStyle="double"
                          tooltipMsg="..."
                          className={classes.input}
                          onChange={(evt) => setParam2(evt.target.value)}
                        />
                      </Grid>
                      <Grid item>
                        <ZodiacTextField
                          label="Parameter 3"
                          borderStyle="double"
                          tooltipMsg="..."
                          className={classes.input}
                          onChange={(evt) => setParam3(evt.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {monitoringService === "custom" && (
                  <Grid item>
                    <ZodiacTextField
                      label="JSON"
                      borderStyle="double"
                      tooltipMsg="..."
                      className={classes.textarea}
                      multiline
                      rows={5}
                      value={customParams}
                      onChange={(evt) => setCustomParams(evt.target.value)}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
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
                onClick={() =>
                  handleNext({
                    monitoringService,
                    param1,
                    param2,
                    param3,
                    customParams,
                  })
                }
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
