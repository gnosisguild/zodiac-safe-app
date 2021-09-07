import React from "react";
import { PanelItem, PanelItemProps } from "./PanelItem";
import { makeStyles, Typography } from "@material-ui/core";
import { Link } from "../../../components/text/Link";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { getNetworkExplorerInfo } from "../../../utils/explorers";

interface ModulePendingItemProps extends PanelItemProps {
  title: string;
  linkText: string;
}

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "bold",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: theme.spacing(0.5),
  },
  link: {
    fontSize: 12,
  },
}));

export const ModulePendingItem = ({
  image = null,
  linkText,
  title,
  ...props
}: ModulePendingItemProps) => {
  const classes = useStyles();
  const { safe } = useSafeAppsSDK();

  const network = getNetworkExplorerInfo(safe.chainId);
  const link = network
    ? new URL(
        `/app/#/safes/${safe.safeAddress}/transactions`,
        network.safeUrl
      ).toString()
    : "";

  return (
    <PanelItem image={image} {...props}>
      <Typography className={classes.title}>{title}</Typography>
      <div>
        <Link target="_parent" href={link} className={classes.link}>
          {linkText}
        </Link>
      </div>
    </PanelItem>
  );
};
