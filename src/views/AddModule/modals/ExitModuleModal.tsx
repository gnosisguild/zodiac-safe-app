import React, { useState } from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as CustomModuleImage } from "../../../assets/images/custom-module-logo.svg";
import { ExitModuleParams, deployExitModule } from "../../../services";
import { ParamInput } from "../../../components/ethereum/ParamInput";
import { ParamType } from "@ethersproject/abi";

interface ExitModuleModalProps {
  open: boolean;

  onClose?(): void;

  onSubmit?(): void;
}

type ExitModuleParamsInput = Omit<ExitModuleParams, "executor">;

const useStyles = makeStyles((theme) => ({
  fields: {
    marginBottom: theme.spacing(1),
  },
  loadMessage: {
    textAlign: "center",
  },
}));

export const ExitModuleModal = ({
  open,
  onClose,
  onSubmit,
}: ExitModuleModalProps) => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();

  const [errors, setErrors] = useState<
    Record<keyof ExitModuleParamsInput, boolean>
  >({
    tokenContract: false,
    circulatingSupply: false,
  });
  const [params, setParams] = useState<ExitModuleParamsInput>({
    tokenContract: "",
    circulatingSupply: "",
  });
  const isValid = Object.values(errors).every((x) => x);

  const onParamChange = <Field extends keyof ExitModuleParamsInput>(
    field: Field,
    value: ExitModuleParamsInput[Field],
    valid: boolean
  ) => {
    setErrors({ ...errors, [field]: valid });
    setParams({
      ...params,
      [field]: value,
    });
  };

  const handleAddExitModule = async () => {
    try {
      const txs = deployExitModule(safe.safeAddress, safe.chainId, {
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
      title="Exit Module"
      description="This module allows any holders of a designated ERC20, at any time, to redeem their designated ERC20 tokens in exchange for a proportional share of the Safe’s ERC20 compatible assets."
      image={<CustomModuleImage />}
      tags={["From Gnosis"]}
      onAdd={handleAddExitModule}
      readMoreLink="https://github.com/gnosis/SafeExit"
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
            value={params.tokenContract}
            label="Token Contract Address"
            onChange={(value, valid) =>
              onParamChange("tokenContract", value, valid)
            }
          />
        </Grid>
        <Grid item xs={12}>
          <ParamInput
            param={ParamType.from("address")}
            color="secondary"
            value={params.circulatingSupply}
            label="Circulating Supply Contract Address"
            onChange={(value, valid) =>
              onParamChange("circulatingSupply", value, valid)
            }
          />
        </Grid>
      </Grid>
    </AddModuleModal>
  );
};
