import React, { useState } from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { AddModuleModal } from "./AddModuleModal";
import AMBModuleImage from "../../../assets/images/bridge-module-logo.png";
import { AMBModuleParams, deployBridgeModule } from "../../../services";
import { ParamInput } from "../../../components/ethereum/ParamInput";
import { ParamType } from "@ethersproject/abi";

interface AMBModuleModalProps {
  open: boolean;

  onClose?(): void;

  onSubmit?(): void;
}

type AMBModuleParamsInput = Omit<AMBModuleParams, "executor">;

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
}));

export const AMBModuleModal = ({
  open,
  onClose,
  onSubmit,
}: AMBModuleModalProps) => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();

  const [errors, setErrors] = useState<
    Record<keyof AMBModuleParamsInput, boolean>
  >({
    amb: false,
    controller: false,
    chainId: false,
  });
  const [params, setParams] = useState<AMBModuleParamsInput>({
    amb: "",
    chainId: "",
    controller: "",
  });
  const isValid = Object.values(errors).every((x) => x);

  const onParamChange = <Field extends keyof AMBModuleParamsInput>(
    field: Field,
    value: AMBModuleParamsInput[Field],
    valid: boolean
  ) => {
    setErrors({ ...errors, [field]: valid });
    setParams({
      ...params,
      [field]: value,
    });
  };

  const handleAddAMBModule = async () => {
    try {
      const txs = deployBridgeModule(safe.safeAddress, safe.chainId, {
        ...params,
        executor: safe.safeAddress,
      });

      await sdk.txs.send({ txs });
      if (onSubmit) onSubmit();
      if (onClose) onClose();
    } catch (error) {
      console.log("Error deploying module: ", error);
    }
  };

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="Bridge Module"
      description="This module allows for execution of transactions initiated by a designated address on the other side of a designated arbitrary message bridge (AMB)."
      image={<img src={AMBModuleImage} alt="Custom Module Logo" />}
      tags={["From Gnosis Guild"]}
      onAdd={handleAddAMBModule}
      readMoreLink="https://github.com/gnosis/SafeBridge"
      ButtonProps={{ disabled: !isValid }}
    >
      <Typography variant="h6" gutterBottom>
        Parameters
      </Typography>

      <Grid container spacing={2} className={classes.fields}>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={params.amb}
            label="AMB Contract Address"
            onChange={(value, valid) => onParamChange("amb", value, valid)}
          />
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={params.controller}
            label="Controller Contract Address"
            onChange={(value, valid) =>
              onParamChange("controller", value, valid)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("uint256")}
            label="Chain Id"
            defaultValue={params.chainId}
            onChange={(value, valid) => onParamChange("chainId", value, valid)}
          />
        </Grid>
      </Grid>
    </AddModuleModal>
  );
};
