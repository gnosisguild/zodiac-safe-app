import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";

interface DisplayFieldProps {
  label: string;
  value?: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    borderRadius: 8,
  },
  label: {
    marginBottom: theme.spacing(0.5),
  },
  field: {
    padding: theme.spacing(1, 0, 1, 1),
  },
  value: { fontSize: 16 },
}));

export const DisplayField = ({ label, value }: DisplayFieldProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography noWrap className={classes.label}>{label}</Typography>
      <Paper className={classes.field} elevation={0}>
        <Typography noWrap className={classes.value}>{value}</Typography>
      </Paper>
    </div>
  );
};
