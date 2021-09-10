import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Icon } from "@gnosis.pm/safe-react-components";
import { ActionButton } from "../../../components/ActionButton";

export interface TransactionBlockHeaderButtonsProps {
  edit?: boolean;
  disabled?: boolean;
  onEdit?(): void;
  onDelete?(): void;
  onSave?(): void;
  onCancel?(): void;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.primary.main,
    width: 20,
    height: 20,
  },
  iconContainer: {
    height: 54,
    cursor: "pointer",
    padding: theme.spacing(2, 0.5),
    marginRight: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  label: {
    color: theme.palette.text.primary,
  },
}));

export const TransactionBlockHeaderButtons = ({
  edit = false,
  disabled = false,
  onCancel,
  onEdit,
  onSave,
  onDelete,
}: TransactionBlockHeaderButtonsProps) => {
  const classes = useStyles();

  if (edit) {
    return (
      <>
        <ActionButton
          disabled={disabled}
          className={classes.button}
          size="small"
          variant="text"
          onClick={onSave}
        >
          Save Changes
        </ActionButton>
        <ActionButton
          onClick={onCancel}
          className={classes.button}
          classes={{ label: classes.label }}
          size="small"
          variant="text"
          color="primary"
        >
          Cancel
        </ActionButton>
      </>
    );
  }

  return (
    <>
      <Box className={classes.iconContainer} onClick={onEdit}>
        <Icon type="edit" size="md" className={classes.icon} />
      </Box>
      <Box className={classes.iconContainer} onClick={onDelete}>
        <Icon type="delete" size="md" className={classes.icon} />
      </Box>
    </>
  );
};
