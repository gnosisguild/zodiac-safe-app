import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Dropdown } from "components/dropdown/Dropdown";
import React, { useState } from "react";
import { colors, ZodiacTextField } from "zodiac-ui-components";
import { InputPartProps } from "../../OracleSection";

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

enum DataKeys {
  INSTANCE = "instance",
  INSTANCE_TYPE = "instanceType",
}

export const OracleInstance: React.FC<InputPartProps> = ({ data, setData }) => {
  const classes = useStyles();

  const set = (key: DataKeys) => (value: any) =>
    setData({ ...data, [key]: value });

  const get = (key: DataKeys) => data[key];

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
          value={get(DataKeys.INSTANCE_TYPE)}
          options={[
            {
              label: "ETH - 0xDf33060F476511F806C72719394da1Ad64",
              value: "eth",
            },
            { label: "Add Custom Instance", value: "custom" },
          ]}
          disableUnderline
          label="Select oracle:"
          onChange={({ target }) => {
            set(DataKeys.INSTANCE_TYPE)(target.value as string);
            if (target.value === "eth") {
              set(DataKeys.INSTANCE)("0xDf33060F476511F806C72719394da1Ad64");
            }
          }}
        />
      </Grid>
      {get(DataKeys.INSTANCE_TYPE) === "custom" && (
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
                value={get(DataKeys.INSTANCE)}
                borderStyle="double"
                className={classes.input}
                onChange={(evt) =>
                  set(DataKeys.INSTANCE)(evt.target.value as string)
                }
              />
            </Grid>
            <Grid item sm={2}>
              {/* //TODO: get the bond token name from the contract} */}
              <Typography style={{ marginTop: 15 }}>WEENUS</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};
