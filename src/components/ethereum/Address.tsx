import React from "react";
import { makeStyles, Theme, Typography } from "@material-ui/core";
import { CopyToClipboardBtn } from "@gnosis.pm/safe-react-components";
import { AddressExplorerButton } from "./AddressExplorerButton";

interface AddressProps {
  address: string;
  spacing?: number;
}

const useStyles = makeStyles<Theme, { spacing: number }>((theme) => ({
  text: (props) => ({
    marginLeft: theme.spacing(props.spacing),
  }),
  icon: (props) => ({
    marginLeft: theme.spacing(props.spacing),
  }),
}));

export const Address = ({ address, spacing = 2 }: AddressProps) => {
  const classes = useStyles({ spacing });

  return (
    <>
      <Typography noWrap className={classes.text}>
        {address}
      </Typography>
      <CopyToClipboardBtn textToCopy={address} className={classes.icon} />
      <AddressExplorerButton address={address} className={classes.icon} />
    </>
  );
};
