import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Dropdown } from "components/dropdown/Dropdown";
import React, { useState } from "react";
import { colors, ZodiacTextField } from "zodiac-ui-components";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
  input: {
    "& .MuiInputBase-root": {
      padding: "9px 8px",
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
}));

export const OracleInstance: React.FC = () => {
  const classes = useStyles();
  const [instance, setInstance] = useState<string>("0x");
  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Oracle Instance
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              The oracle instance sets the appropriate bond token. It&apos;s
              recommended to use the default (ETH) oracle instance unless you
              have a specific reason to use something like a native token which
              can potentially be more prone to price manipulation.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Dropdown
          value={instance}
          options={[
            {
              label: "ETH - 0xDf33060F476511F806C72719394da1Ad64",
              value: "0x",
            },
            { label: "Add Custom Instance", value: "custom" },
          ]}
          disableUnderline
          label="Select oracle:"
          onChange={(evt) => setInstance(evt.target.value as string)}
        />
      </Grid>
      {instance === "custom" && (
        <Grid item>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item sm={10}>
              <ZodiacTextField
                label="Contract Address"
                borderStyle="double"
                className={classes.input}
              />
            </Grid>
            <Grid item sm={2}>
              <Typography style={{ marginTop: 15 }}>WEENUS</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
