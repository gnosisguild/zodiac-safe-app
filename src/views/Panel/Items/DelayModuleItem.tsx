import { HashInfo } from "../../../components/ethereum/HashInfo";
import { Link, makeStyles, Typography } from "@material-ui/core";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { DelayModule } from "../../../store/modules/models";
import { Badge } from "../../../components/text/Badge";
import { Address } from "../../../components/ethereum/Address";
import { ModuleList } from "../ModuleList";
import { formatDuration } from "../../../utils/string";
import { useRootDispatch, useRootSelector } from "../../../store";
import { setNewTransaction } from "../../../store/transactionBuilder";
import { setCurrentModule, setOperation } from "../../../store/modules";
import { RemoveIcon } from "../../../components/icons/RemoveIcon";
import { getSafeThreshold } from "../../../store/modules/selectors";

interface DelayModuleItemProps extends PanelItemProps {
  module: DelayModule;
  remove?: boolean;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
  },
  link: {
    marginLeft: theme.spacing(1),
  },
}));

export const DelayModuleItem = ({
  module,
  remove,
  ...panelItemProps
}: DelayModuleItemProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();
  const safeThreshold = useRootSelector(getSafeThreshold);
  const instant = safeThreshold === 1;

  const handleClick = (evt: React.MouseEvent) => {
    evt.stopPropagation(); // Avoid triggering ModuleItem click event.

    dispatch(setCurrentModule(module));
    dispatch(setOperation("write"));
    dispatch(
      setNewTransaction({
        func: "setTxCooldown(uint256)",
        params: [module.cooldown],
      })
    );
  };

  return (
    <>
      <PanelItem
        image={
          remove ? (
            <RemoveIcon instant={instant} />
          ) : (
            <HashInfo
              showAvatar
              avatarSize="lg"
              showHash={false}
              hash={module.address}
            />
          )
        }
        {...panelItemProps}
      >
        <Typography variant="h6" className={classes.text} gutterBottom>
          {module.name}
        </Typography>
        <Address
          short
          showOnHover
          spacing={0}
          iconSpacing={1}
          address={module.address}
          variant="body2"
          className={classes.text}
          gutterBottom
        />
        <div>
          <Badge>{formatDuration(module.timeout)} delay</Badge>
          <Link
            color="secondary"
            noWrap
            className={classes.link}
            onClick={handleClick}
          >
            Change Delay
          </Link>
        </div>
      </PanelItem>

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </>
  );
};
