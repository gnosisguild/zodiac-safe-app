import React from "react";
import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";

interface ModuleButtonProps {
  title: string;
  description: string;
  image: React.ReactElement;
  onClick(): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    cursor: "pointer",
    userSelect: "none",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    marginBottom: theme.spacing(1),
  },
}));

export const ModuleButton = ({
  title,
  description,
  image,
  onClick,
}: ModuleButtonProps) => {
  const classes = useStyles();
  return (
    <Paper className={classes.root} onClick={onClick}>
      <Grid container direction="row">
        <Grid item xs={3}>
          {image}
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h6" className={classes.spacing}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
