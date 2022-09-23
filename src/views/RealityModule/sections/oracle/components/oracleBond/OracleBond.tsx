import { Grid, Link, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { ZodiacTextField, colors } from "zodiac-ui-components";
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
      borderColor: colors.tan[300],
      "&::before": {
        borderColor: colors.tan[300],
      },
    },
  },
}));

export type Data = {
  bond: number;
};

export const OracleBond: React.FC<InputPartProps> = ({ data, setData }) => {
  const classes = useStyles();

  const set = (key: keyof Data) => (value: any) =>
    setData({ ...data, [key]: value });

  const get = (key: keyof Data) => data[key];

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item>
        <Grid container spacing={1} className={classes.container}>
          <Grid item>
            <Typography variant="h4" color="textSecondary">
              Bond
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" className={classes.textSubdued}>
              Minimum bond required for an answer to be accepted. New answers
              must be submitted with double the previous bond. For more on why a
              bond is required in an escalation-game-based oracle, read more in
              the
              {` `}
              <Link
                underline="always"
                href="http://reality.eth.link/app/docs/html/whitepaper.html"
                target={"_blank"}
                color="inherit"
              >
                Reality.eth whitepaper.
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <ZodiacTextField
          label="Bond"
          color="secondary"
          borderStyle="double"
          className={classes.input}
          prefix="ETH"
          value={get("bond")}
          onChange={(e) => set("bond")(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};
