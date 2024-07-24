import React from "react";
import { makeStyles } from "@material-ui/core";
import { ReactComponent as LoadingCircleImg } from "../../assets/images/loading-circle.svg";

interface LoadingIconProps {
  icon?: React.ReactNode;
}

const useStyles = makeStyles(() => ({
  root: {
    position: "relative",
    width: 34,
    height: 34,
  },
  floating: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {},
  rotate: {
    animationName: "$rotate",
    animationDuration: "2000ms",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  "@keyframes rotate": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
}));

export const LoadingIcon = ({ icon }: LoadingIconProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.floating}>
        <LoadingCircleImg className={classes.rotate} />
      </div>
      <div className={classes.floating}>{icon}</div>
    </div>
  );
};
