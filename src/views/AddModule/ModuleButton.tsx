import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Row } from "../../components/layout/Row";

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
  imageContainer: {
    marginRight: theme.spacing(2),
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
      <Row>
        <div className={classes.imageContainer}>{image}</div>
        <div>
          <Typography variant="h6" className={classes.spacing}>
            {title}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </div>
      </Row>
    </Paper>
  );
};
