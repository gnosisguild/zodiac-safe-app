import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { Column } from "../../../components/layout/Column";
import { ReactComponent as AvatarEmptyIcon } from "../../../assets/icons/avatar-empty.svg";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    borderRadius: 8,
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "40px 1fr",
    maxWidth: 324,
  },
  text: {
    fontSize: 14,
    color: "rgba(0,20,40,0.5)",
  },
  title: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    lineHeight: 1,
  },
  details: {
    marginLeft: theme.spacing(3),
  },
}));
export const TransactionBuilderEmptyList = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <AvatarEmptyIcon />
        <Column className={classes.details}>
          <Typography
            variant="body1"
            className={classNames(classes.text, classes.title)}
          >
            No Transactions Added
          </Typography>
          <Typography variant="body1" className={classes.text}>
            Add transactions via the Write tab on any module, and view them here
            before submitting them as a bundle.
          </Typography>
        </Column>
      </div>
    </div>
  );
};
