import React from "react";
import { Box, CircularProgress, makeStyles } from "@material-ui/core";
import { HashInfo } from "../../components/ethereum/HashInfo";
import { Button, Text } from "@gnosis.pm/safe-react-components";
import { Address } from "../../components/ethereum/Address";
import { Module } from "../../store/modules/models";
import { disableModule } from "services";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useFetchTransaction } from "hooks/useFetchTransaction";

interface ModuleDetailHeaderProps {
  module: Module;
}

const useStyles = makeStyles((theme) => ({
  header: {
    minHeight: 88,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  text: {
    marginLeft: "16px !important",
    color: theme.palette.text.primary + " !important",
  },
  icon: {
    marginLeft: "16px",
  },
}));

export const ModuleDetailHeader = ({ module }: ModuleDetailHeaderProps) => {
  const classes = useStyles();
  const { sdk, safe } = useSafeAppsSDK();

  const { setLoading, setSafeTxSuccessful, setSafeHash, loading } =
    useFetchTransaction();

  const removeModule = async () => {
    setLoading(true);
    const transactions = await disableModule(safe.safeAddress, module.address);
    const { safeTxHash } = await sdk.txs.send({
      txs: [transactions],
    });
    setSafeTxSuccessful(false);
    setSafeHash(safeTxHash);
  };

  return (
    <div className={classes.header}>
      <HashInfo
        showAvatar
        showHash={false}
        avatarSize="lg"
        hash={module.address}
      />
      <Text size="xl" strong className={classes.text}>
        Address:
      </Text>
      <Address address={module.address} />

      <Box flexGrow={1} />

      {loading ? (
        <CircularProgress />
      ) : (
        <Button
          size="md"
          iconType="delete"
          variant="outlined"
          onClick={removeModule}
        >
          Remove
        </Button>
      )}
    </div>
  );
};
