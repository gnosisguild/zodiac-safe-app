import React, { useState } from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { Grid, Link, makeStyles, Typography } from "@material-ui/core";
import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as CustomModuleImage } from "../../../assets/images/custom-module-logo.svg";
import { deployExitModule, ExitModuleParams } from "../../../services";
import { ParamInput } from "../../../components/ethereum/ParamInput";
import { ParamType } from "@ethersproject/abi";
import { Row } from "../../../components/layout/Row";
import { Grow } from "../../../components/layout/Grow";

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
  text: {
    fontSize: 14,
  },
  textLink: {
    cursor: "pointer",
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
    circulatingSupplyAddress: false,
  });
  const [params, setParams] = useState<ExitModuleParamsInput>({
    tokenContract: "",
    circulatingSupply: "",
  });
  const [enterAddress, setEnterAddress] = useState(false);

  const isValid =
    errors.tokenContract &&
    (enterAddress ? errors.circulatingSupplyAddress : errors.circulatingSupply);

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
      const args = enterAddress
        ? {
            tokenContract: params.tokenContract,
            circulatingSupplyAddress: params.circulatingSupplyAddress,
          }
        : {
            tokenContract: params.tokenContract,
            circulatingSupply: params.circulatingSupply,
          };
      const txs = deployExitModule(safe.safeAddress, safe.chainId, {
        ...args,
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
      readMoreLink="https://github.com/gnosis/zodiac-module-exit"
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
          <Row style={{ alignItems: "center" }}>
            <Typography className={classes.text}>
              Circulating Supply {enterAddress ? "Address" : "Amount"}
            </Typography>
            <Grow />
            <Link
              color="secondary"
              target="_blank"
              onClick={() => setEnterAddress(!enterAddress)}
              className={classes.textLink}
            >
              {enterAddress ? "Deploy a New Contract" : "Use Existing Contract"}
            </Link>
          </Row>

          {enterAddress ? (
            <ParamInput
              key="circulatingSupplyAddress"
              param={ParamType.from("address")}
              color="secondary"
              value={params.circulatingSupplyAddress}
              onChange={(value, valid) =>
                onParamChange("circulatingSupplyAddress", value, valid)
              }
              label={undefined}
              placeholder="0x325a2e0F3CCA2ddbaeBB4DfC38Df8D19ca165b47"
            />
          ) : (
            <ParamInput
              key="circulatingSupply"
              param={ParamType.from("uint256")}
              color="secondary"
              value={params.circulatingSupply}
              onChange={(value, valid) =>
                onParamChange("circulatingSupply", value, valid)
              }
              label={undefined}
              placeholder="16579517055253348798759097"
            />
          )}
        </Grid>
      </Grid>
    </AddModuleModal>
  );
};
