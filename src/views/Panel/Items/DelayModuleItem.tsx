import { HashInfo } from "../../../components/ethereum/HashInfo";
import { Link, makeStyles, Typography } from "@material-ui/core";
import { PanelItem, PanelItemProps } from "./PanelItem";
import React from "react";
import { DelayModule } from "../../../store/modules/models";
import { Badge } from "../../../components/text/Badge";
import { Address } from "../../../components/ethereum/Address";
import { ModuleList } from "../ModuleList";
import { formatDuration } from "../../../utils/string";
import { useRootDispatch } from "../../../store";
import { setNewTransaction } from "../../../store/transactionBuilder";
import { setCurrentModule, setOperation } from "../../../store/modules";
import { Row } from "../../../components/layout/Row";

interface DelayModuleItemProps extends PanelItemProps {
  module: DelayModule;
}

const useStyles = makeStyles((theme) => ({
  text: {
    lineHeight: 1,
  },
  link: {
    marginLeft: theme.spacing(1),
    lineHeight: 1,
  },
}));

export const DelayModuleItem = ({
  module,
  ...panelItemProps
}: DelayModuleItemProps) => {
  const classes = useStyles();
  const dispatch = useRootDispatch();

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
          <HashInfo
            showAvatar
            avatarSize="lg"
            showHash={false}
            hash={module.address}
          />
        }
        {...panelItemProps}
      >
        <Typography variant="h6" className={classes.text} gutterBottom>
          {module.name}
        </Typography>
        <Address
          short
          showOnHover
          gutterBottom
          address={module.address}
          TypographyProps={{
            variant: "body2",
            className: classes.text,
          }}
        />
        <Row alignItems="center">
          <Badge>{formatDuration(module.expiration)} delay</Badge>
          <Link
            color="secondary"
            noWrap
            className={classes.link}
            onClick={handleClick}
          >
            Change Delay
          </Link>
        </Row>
      </PanelItem>

      {module.subModules.length ? (
        <ModuleList sub modules={module.subModules} />
      ) : null}
    </>
  );
};
