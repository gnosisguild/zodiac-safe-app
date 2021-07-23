import React from "react";
import { PanelItem } from "./PanelItem";
import { ReactComponent as DaoModulePendingImg } from "../../../assets/images/dao-module-pending.svg";
import { makeStyles, Typography } from "@material-ui/core";
import { Link } from "../../../components/text/Link";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { getNetworkExplorerInfo } from "../../../utils/explorers";

const useStyles = makeStyles((theme) => ({
  greyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(0,20,40,0.5)",
  },
  link: { fontSize: 12 },
}));

export const DaoModulePendingItem = () => {
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
    <PanelItem image={<DaoModulePendingImg />}>
      <Typography className={classes.greyText}>DAO Module</Typography>
      <Link target="_parent" href={link} className={classes.link}>
        Awaiting approval
      </Link>
    </PanelItem>
  );
};
