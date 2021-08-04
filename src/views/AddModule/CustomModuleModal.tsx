import React, { useState } from "react";
import { ParamInput } from "../../components/ethereum/ParamInput";
import { ParamType } from "@ethersproject/abi";
import { enableModule } from "services";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { ReactComponent as CustomModuleImage } from "../../assets/images/custom-module-logo.svg";
import { AddModuleModal } from "./modals/AddModuleModal";

interface AddCustomModuleProps {
  open: boolean;

  onClose?(): void;

  onSubmit?(): void;
}

// TODO: Implement "Attach Delay Module"
export const CustomModuleModal = ({
  onSubmit,
  open,
  onClose,
}: AddCustomModuleProps) => {
  const { sdk, safe } = useSafeAppsSDK();

  const [address, setAddress] = useState("");
  const [isAddressValid, setAddressValid] = useState(false);

  const handleAddressChange = (address: string, isValid: boolean) => {
    setAddress(address);
    setAddressValid(!!address.length && isValid);
  };

  const resetState = () => {
    if (onClose) onClose();
    setAddress("");
    setAddressValid(false);
  };

  const addModule = async () => {
    const tx = await enableModule(safe.safeAddress, address);

    try {
      await sdk.txs.send({ txs: [tx] });
      resetState();
      if (onSubmit) onSubmit();
    } catch (error) {
      console.warn("error adding custom module", error);
    }
  };

  return (
    <AddModuleModal
      open={open}
      onClose={onClose}
      title="Custom Module"
      image={<CustomModuleImage />}
      onAdd={addModule}
      ButtonProps={{ disabled: !isAddressValid }}
      warning="Modules do not require multisig approval for transactions. Only add modules that you trust!"
    >
      <ParamInput
        placeholder="0xCcBFc37093009fd31f85F1Bf90c34F1e03FB351E"
        label="Module Address"
        param={ParamType.fromString("address")}
        onChange={handleAddressChange}
      />
    </AddModuleModal>
  );
};
