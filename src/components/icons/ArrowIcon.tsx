import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
import { ReactComponent as ChevronDownIcon } from "../../assets/icons/chevron-down.svg";
import React from "react";

const useStyles = makeStyles((theme) => ({
  arrowIcon: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    fill: "#B2B5B2",
    width: 18,
    height: 10,
    "&.rotate": {
      transform: "rotate(180deg)",
    },
  },
}));

interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {
  up?: boolean;
}

export const ArrowIcon = ({
  up = false,
  className,
  ...props
}: ArrowIconProps) => {
  const classes = useStyles();
  return (
    <ChevronDownIcon
      className={classNames(classes.arrowIcon, { rotate: up }, className)}
      {...props}
    />
  );
};
