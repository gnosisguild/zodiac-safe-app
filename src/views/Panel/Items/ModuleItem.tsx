import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Typography } from "@material-ui/core";
import {
  PANEL_ITEM_CONTENT_HEIGHT,
  PanelItem,
  PanelItemProps,
} from "./PanelItem";
import React from "react";
import { Module } from "../../../store/modules/models";
import { DelayModuleItem } from "./DelayModuleItem";
import { isDelayModule } from "../../../store/modules/helpers";
import { ModuleList } from "../ModuleList";
import { Address } from "../../../components/ethereum/Address";
import { ModulePendingRemoval } from "./ModulePendingRemovalItem";
import { Badge } from "../../../components/text/Badge";
import { shortAddress } from "../../../utils/string";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";

interface ModuleItemProps extends PanelItemProps {
  remove?: boolean;
  instant?: boolean;
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
    letterSpacing: "1px",
  },
  name: {
    textTransform: "uppercase",
  },
  address: {
    fontFamily: "Roboto Mono",
  },
  badge: {
    marginTop: theme.spacing(1),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: PANEL_ITEM_CONTENT_HEIGHT,
  },
}));

interface ModuleItemContentProps extends ModuleItemProps {
  classes: Record<string, string>;
}

export const ModuleItemContent = (props: ModuleItemContentProps) => {
  const { module, classes, ...panelItemProps } = props;
  const { safe } = useSafeAppsSDK();

  if (isDelayModule(module)) {
    return <DelayModuleItem module={module} {...panelItemProps} />;
  }

  const ownerBadge =
    module.owner && module.owner !== safe.safeAddress ? (
      <Badge secondary={shortAddress(module.owner)} className={classes.badge}>
        External Owner
      </Badge>
    ) : null;

  return (
    <>
      {module.name ? (
        <Typography variant="body2" className={classes.name} gutterBottom>
          {module.name}
        </Typography>
      ) : null}
      <Address
        short
        showOnHover
        address={module.address}
        TypographyProps={{
          variant: "body2",
          className: classes.address,
        }}
      />
      {ownerBadge}
    </>
  );
};

export const ModuleItem = (props: ModuleItemProps) => {
  const {
    module,
    remove = false,
    instant = false,
    onClick,
    ...panelItemProps
  } = props;

  const classes = useStyles();

  if (remove) {
    return (
      <ModulePendingRemoval
        module={module}
        instant={instant}
        onClick={onClick}
        {...panelItemProps}
      />
    );
  }

  return (
    <PanelItem
      image={
        <HashInfo
          showAvatar
          avatarSize="lg"
          showHash={false}
          hash={module.address}
        />
      }
      {...panelItemProps}
    >
      <div onClick={onClick} className={classes.content}>
        <ModuleItemContent classes={classes} {...props} />
      </div>

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </PanelItem>
  );
};
