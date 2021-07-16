import React, { useState } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { ArrowIcon } from "../../components/icons/ArrowIcon";
import { Collapsable } from "../../components/Collapsable";
import { Row } from "../../components/layout/Row";
import { Icon } from "@gnosis.pm/safe-react-components";
import { ActionButton } from "../../components/ActionButton";
import { ParamInput } from "../../components/ethereum/ParamInput";
import { ParamType } from "@ethersproject/abi";
import { AttachDelayModuleForm } from "./AttachDelayModuleForm";
import { useRootSelector } from "../../store";
import { getDelayModules } from "../../store/modules/selectors";

const useStyles = makeStyles((theme) => ({
  clickable: {
    cursor: "pointer",
  },
  warningIcon: {
    marginRight: theme.spacing(1),
    "& .icon-color": {
      fill: "#E0B325 !important",
    },
  },
  spacing: {
    marginBottom: theme.spacing(2),
  },
}));

// TODO: Implement - Add Custom Module
export const AddCustomModule = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [address, setAddress] = useState("");
  const [isAddressValid, setAddressValid] = useState(false);
  const [delayModule, setDelayModule] = useState<string>();
  const delayModules = useRootSelector(getDelayModules);

  const handleAddressChange = (address: string, isValid: boolean) => {
    setAddress(address);
    setAddressValid(!!address.length && isValid);
  };

  const content = (
    <>
      <Row alignItems="center" className={classes.spacing}>
        <Icon type="error" size="md" className={classes.warningIcon} />
        <div>
          <Typography variant="body2">
            Modules do not require multisig approval for transactions.
          </Typography>
          <Typography variant="body2">
            Only add modules that you trust!
          </Typography>
        </div>
      </Row>
      <ParamInput
        placeholder="0xCcBFc37093009fd31f85F1Bf90c34F1e03FB351E"
        label="Module Address"
        className={classes.spacing}
        param={ParamType.fromString("address")}
        onChange={handleAddressChange}
      />

      <Typography variant="h6" gutterBottom>
        Deploy Options
      </Typography>
      <div className={classes.spacing}>
        <AttachDelayModuleForm
          modules={delayModules}
          value={delayModule}
          onChange={(value) => setDelayModule(value)}
        />
      </div>

      <ActionButton
        fullWidth
        disabled={!isAddressValid}
        startIcon={<Icon type="sent" size="md" color="primary" />}
      >
        Add Module
      </ActionButton>
    </>
  );

  return (
    <Collapsable open={open} content={content}>
      <Row
        alignItems="center"
        className={classes.clickable}
        onClick={() => setOpen(!open)}
      >
        <Typography variant="h6">Add a custom module</Typography>
        <Box flexGrow={1} />
        <ArrowIcon up={open} />
      </Row>
    </Collapsable>
  );
};
