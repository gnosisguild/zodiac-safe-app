import { AddModuleModal } from "./AddModuleModal";
import { ReactComponent as DaoModuleImage } from "../../../assets/images/dao-module.svg";
import React from "react";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { createAndAddModule } from "../../../services";
import { useRootDispatch } from "../../../store";
import { fetchModulesList } from "../../../store/modules";

interface DaoModuleModalProps {
  open: boolean;

  onClose?(): void;
}

export const DaoModuleModal = ({ open, onClose }: DaoModuleModalProps) => {
  const { sdk, safe } = useSafeAppsSDK();
  const dispatch = useRootDispatch();

  const handleAddDaoModule = async () => {
    try {
      const txs = await createAndAddModule(
        "dao",
        {
          executor: safe.safeAddress,
          timeout: 100,
          cooldown: 180,
          expiration: 2000,
          bond: 10000,
          templateId: 10,
        },
        safe.safeAddress
      );

      const { safeTxHash } = await sdk.txs.send({
        txs,
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });

      dispatch(
        fetchModulesList({
          safeSDK: sdk,
          chainId: safe.chainId,
          safeAddress: safe.safeAddress,
        })
      );
    } catch (error) {
      console.log("Error deploying module: ");
      console.log(error);
    }
  };

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="DAO Module"
      description="Allows Reality.eth questions to execute a transaction when resolved."
      image={<DaoModuleImage />}
      tags={["Stackable", "Has SafeApp", "From Gnosis"]}
      onAdd={handleAddDaoModule}
      readMoreLink="https://help.gnosis-safe.io/en/articles/4934378-what-is-a-module"
    />
  );
};
