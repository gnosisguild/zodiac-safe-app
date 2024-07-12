import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { colors } from "zodiac-ui-components";

type CircleStepProps = {
  label: string;
  number: number;
  onClick: () => void;
  disabled?: boolean;
};

const useStyles = makeStyles(() => ({
  circle: {
    padding: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    height: 25,
    width: 25,
    border: `1px solid ${colors.tan[300]}`,
    background: colors.blue[500],
  },
  label: {
    display: "inline",
    fontFamily: "Roboto Mono",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export const CircleStep: React.FC<CircleStepProps> = ({
  label,
  number,
  disabled,
  onClick,
}) => {
  const classes = useStyles();
  return (
    <Grid
      container
      spacing={1}
      alignItems='center'
      onClick={() => {
        !disabled && onClick();
      }}>
      <Grid item>
        <Box className={classes.circle}>
          <Typography>{number}</Typography>
        </Box>
      </Grid>
      <Grid item>
        <Typography className={classes.label}>{label}</Typography>
      </Grid>
    </Grid>
  );
};
