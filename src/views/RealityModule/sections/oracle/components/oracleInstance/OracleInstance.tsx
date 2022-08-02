import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Dropdown } from "components/dropdown/Dropdown";
import React from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  textSubdued: {
    color: "rgba(255 255 255 / 70%)",
  },
}));

export const OracleInstance: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item>
            <Typography variant='h4' color='textSecondary'>
              Oracle Instance
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2' className={classes.textSubdued}>
              The oracle instance sets the appropriate bond token. It’s
              recommended to use the default (ETH) oracle instance unless you
              have a specific reason to use something like a native token which
              can potentially be more prone to price manipulation.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Dropdown
          defaultValue='0x'
          options={[
            {
              label: "ETH - 0xDf33060F476511F806C72719394da1Ad64",
              value: "0x",
            },
            { label: "Add Custom Instance", value: "custom" },
          ]}
          disableUnderline
          label='Select oracle:'
          onChange={(evt) => console.log("evt", evt.target.value)}
        />
      </Grid>
    </Grid>
  );
};
