import React from "react";
import {
  makeStyles,
  Theme,
  Typography,
  TypographyProps,
} from "@material-ui/core";
import { CopyToClipboardBtn } from "@gnosis.pm/safe-react-components";
import { AddressExplorerButton } from "./AddressExplorerButton";
import { shortAddress } from "../../utils/string";

interface AddressProps extends TypographyProps {
  address: string;
  spacing?: number;
  short?: boolean;
  hideCopyBtn?: boolean;
  hideExplorerBtn?: boolean;
}

const useStyles = makeStyles<Theme, { spacing: number }>((theme) => ({
  text: (props) => ({
    marginLeft: theme.spacing(props.spacing),
  }),
  icon: (props) => ({
    marginLeft: theme.spacing(props.spacing),
  }),
}));

export const Address = ({
  address,
  spacing = 2,
  short = false,
  hideCopyBtn = false,
  hideExplorerBtn = false,
  ...typographyProps
}: AddressProps) => {
  const classes = useStyles({ spacing });

  return (
    <>
      <Typography noWrap className={classes.text} {...typographyProps}>
        {short ? shortAddress(address) : address}
      </Typography>
      {hideCopyBtn ? null : (
        <CopyToClipboardBtn textToCopy={address} className={classes.icon} />
      )}
      {hideExplorerBtn ? null : (
        <AddressExplorerButton address={address} className={classes.icon} />
      )}
    </>
  );
};
