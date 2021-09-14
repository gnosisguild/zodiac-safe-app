import React from "react";
import { makeStyles } from "@material-ui/core";
import { alpha } from "@material-ui/core/styles";
import classNames from "classnames";
import { Row } from "../layout/Row";

const useStyles = makeStyles((theme) => ({
  badge: {
    display: "inline-block",
    padding: theme.spacing(0.25, 0.5),
    lineHeight: 1,
    whiteSpace: "nowrap",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  primary: {
    backgroundColor: "rgba(224, 197, 173, 0.1)",
  },
  secondary: {
    backgroundColor: alpha(theme.palette.primary.light, 0.4),
  },
}));

interface BadgeProps extends React.HTMLProps<HTMLDivElement> {
  secondary?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  secondary,
  children,
  className,
  ...props
}) => {
  const classes = useStyles();

  if (secondary) {
    return (
      <Row style={{ alignItems: "center" }}>
        <div
          className={classNames(classes.badge, classes.primary, className)}
          {...props}
        >
          {children}
        </div>
        <div
          className={classNames(classes.badge, classes.secondary, className)}
          {...props}
        >
          {secondary}
        </div>
      </Row>
    );
  }

  return (
    <div
      className={classNames(classes.badge, classes.primary, className)}
      {...props}
    >
      {children}
    </div>
  );
};
