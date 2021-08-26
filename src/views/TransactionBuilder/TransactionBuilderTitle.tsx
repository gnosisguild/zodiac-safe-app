import React from "react";
import { makeStyles, Tooltip, Typography } from "@material-ui/core";
import { ReactComponent as QuestionMarkIcon } from "../../assets/icons/question-icon.svg";

const useStyles = makeStyles((theme) => ({
  tooltip: {
    padding: theme.spacing(1, 0.5, 1, 1),
    backgroundColor: theme.palette.common.white,
    maxWidth: 250,
    fontSize: 14,
    color: theme.palette.text.primary,
  },
  questionIcon: {
    marginLeft: theme.spacing(1),
  },
}));

export const TransactionBuilderTitle = () => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h4">Transaction Builder</Typography>

      <Tooltip
        classes={{ tooltip: classes.tooltip }}
        title="Bundling transactions allows you to setup multiple contract interactions and send them in one transaction, saving you gas"
      >
        <QuestionMarkIcon className={classes.questionIcon} />
      </Tooltip>
    </>
  );
};
