import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Link, makeStyles, Typography } from "@material-ui/core";
import { Address } from "components/ethereum/Address";
import { Row } from "components/layout/Row";

import React from "react";
import { SUPPORTED_SAFE_CHAIN } from "store/modules/constants";
import { Module } from "store/modules/models";
import { PanelItemProps } from "./PanelItem";

interface ExitModuleItemProps extends PanelItemProps {
  module: Module;
}
const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridGap: theme.spacing(0.25),
    "& > *": {
      gridColumn: 1,
    },
  },
  text: {
    lineHeight: 1,
    letterSpacing: 1,
  },
  moduleName: {
    textTransform: "uppercase",
  },
  address: {
    fontFamily: "Roboto Mono",
  },
  link: {
    marginLeft: theme.spacing(1),
    lineHeight: 1,
    cursor: "pointer",
  },
}));

export const ExitModuleItem: React.FC<ExitModuleItemProps> = ({ module }) => {
  const classes = useStyles();
  const { safe } = useSafeAppsSDK();

  const handleClick = () => {
    const chainId = safe.chainId as number;
    const currentChain = SUPPORTED_SAFE_CHAIN[chainId as keyof typeof SUPPORTED_SAFE_CHAIN];
    const prevUrl = window.location.ancestorOrigins[0];
    if (prevUrl) {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        const DEV = process.env.REACT_APP_ROLES_APP_DEV;
        const newUrl = `${prevUrl}/app/${currentChain}:${module.owner}/apps?appUrl=${DEV}/#/${currentChain}:${module.owner}`;
        window.open(newUrl, "_blank");
      } else {
        const PROD = process.env.REACT_APP_ROLES_APP_PROD;
        const newUrl = `${prevUrl}/app/${currentChain}:${module.owner}/apps?appUrl=${PROD}/#/${currentChain}:${module.owner}`;
        window.open(newUrl, "_blank");
      }
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant='body2' className={classes.moduleName}>
        {module.name}
      </Typography>

      <Row style={{ alignItems: "space-between" }}>
        <Address
          short
          showOnHover
          address={module.address}
          TypographyProps={{
            variant: "body2",
            className: classes.address,
          }}
        />
        <Link color='textPrimary' noWrap className={classes.link} onClick={handleClick}>
          Open Roles App
        </Link>
      </Row>
    </div>
  );
};
