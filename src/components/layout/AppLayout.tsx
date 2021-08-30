import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    height: "100%",
  },
  container: {
    display: "grid",
    height: "100%",
    gridTemplateColumns: "380px 1fr",
    border: "1px solid #E8E7E6",
    borderRadius: theme.spacing(1),
    overflow: "hidden"
  },
  leftPanel: {
    overflowY: "auto",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    position: "relative",
    overflowY: "auto",
    background: "white",
  },
}));

interface AppLayoutProps {
  left: React.ReactElement;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, left }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
    <div className={classes.container}>
      <div className={classes.leftPanel}>{left}</div>
      <div id="app-content" className={classes.content}>
        {children}
      </div>
    </div>
    </div>
  );
};
