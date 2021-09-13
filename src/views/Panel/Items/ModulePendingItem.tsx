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
    marginBottom: theme.spacing(0.5),
    textTransform: "uppercase",
  },
  link: {
    fontSize: 12,
  },
  image: {
    width: 50,
    height: 50,
    display: "inline-flex !important",
    padding: theme.spacing(0.5),
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: "50%",
    borderColor: "rgba(255, 255, 255, 0.2)",
    background: "rgba(224, 197, 173, 0.1)",
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
    <PanelItem image={<div className={classes.image}>{image}</div>} {...props}>
      <Typography variant="body2" className={classes.title}>
        {title}
      </Typography>
      <div>
        <Link target="_parent" href={link} className={classes.link}>
          {linkText}
        </Link>
      </div>
    </PanelItem>
  );
};
