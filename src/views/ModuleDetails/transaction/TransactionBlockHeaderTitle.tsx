import React from "react";
import classNames from "classnames";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { ArrowIcon } from "../../../components/icons/ArrowIcon";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2, 0.5, 2, 0),
    marginRight: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flexGrow: 1,
  },
  clickable: {
    cursor: "pointer",
  },
}));

export interface TransactionBlockHeaderTitleProps {
  edit: boolean;
  open: boolean;
  title: string;

  onToggle(): void;
}

export const TransactionBlockHeaderTitle = ({
  edit,
  open,
  title,
  onToggle,
}: TransactionBlockHeaderTitleProps) => {
  const classes = useStyles();
  return (
    <Box
      className={classNames(classes.title, {
        [classes.clickable]: !edit,
      })}
      onClick={onToggle}
    >
      <Typography variant="h6">{title}</Typography>
      <Box flexGrow={1} />
      {!edit ? <ArrowIcon up={open} /> : null}
    </Box>
  );
};
