import { HashInfo } from "../../../components/ethereum/HashInfo";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { PANEL_ITEM_MARGIN, PanelItem, PanelItemProps } from "./PanelItem";
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
import classNames from "classnames";

interface ModuleItemProps extends PanelItemProps {
  remove?: boolean;
  instant?: boolean;
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  active: {
    backgroundColor: "rgba(0, 0, 0, 0.54)",
  },
  spacing: {
    "& + &, &.sub": {
      marginTop: PANEL_ITEM_MARGIN,
    },
  },
  text: {
    lineHeight: 1,
    fontSize: 12,
    letterSpacing: "1px",
  },
  address: {
    fontFamily: "Roboto Mono",
  },
  badge: {
    marginTop: theme.spacing(1),
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
        <Typography variant="h6" className={classes.text} gutterBottom>
          {module.name}
        </Typography>
      ) : null}
      <Address
        short
        showOnHover
        address={module.address}
        TypographyProps={{
          variant: "body2",
          className: classNames(classes.text, classes.address),
        }}
      />
      {ownerBadge}
    </>
  );
};

export const ModuleItem = (props: ModuleItemProps) => {
  const { module, remove = false, instant = false, ...panelItemProps } = props;

  const classes = useStyles();

  if (remove) {
    return (
      <ModulePendingRemoval
        module={module}
        instant={instant}
        {...panelItemProps}
      />
    );
  }

  const panelItem = (
    <PanelItem
      image={
        <div>
          <HashInfo
            showAvatar
            avatarSize="lg"
            showHash={false}
            hash={module.address}
          />
        </div>
      }
      {...panelItemProps}
    >
      <ModuleItemContent classes={classes} {...props} />
    </PanelItem>
  );

  return (
    <Paper
      className={classNames(classes.root, classes.spacing, {
        sub: panelItemProps.sub,
        [classes.active]: panelItemProps.active,
      })}
    >
      {panelItem}
      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </Paper>
  );
};
