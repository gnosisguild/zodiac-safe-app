import React from "react";
import { makeStyles, Theme } from "@material-ui/core";
import { CopyToClipboardBtn, Text } from "@gnosis.pm/safe-react-components";
import { AddressExplorerButton } from "./AddressExplorerButton";

interface AddressProps {
  address: string;
  spacing?: number;
}

const useStyles = makeStyles<Theme, { spacing: number }>((theme) => ({
  text: (props) => ({
    marginLeft: theme.spacing(props.spacing) + " !important",
    color: theme.palette.text.primary + " !important",
  }),
  icon: (props) => ({
    marginLeft: theme.spacing(props.spacing),
  }),
}));

export const Address = ({ address, spacing = 2 }: AddressProps) => {
  const classes = useStyles({ spacing });

  return (
    <>
      <Text size="xl" className={classes.text}>
        {address}
      </Text>
      <CopyToClipboardBtn textToCopy={address} className={classes.icon} />
      <AddressExplorerButton address={address} className={classes.icon} />
    </>
  );
};
