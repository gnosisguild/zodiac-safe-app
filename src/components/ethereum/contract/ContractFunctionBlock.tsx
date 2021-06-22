import React, { useEffect } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { Box, makeStyles } from "@material-ui/core";
import { Collapsable } from "../../Collapsable";
import { Address } from "../Address";
import { callContract } from "../../../services";

interface ContractFunctionBlockProps {
  address: string;
  abi: string | string[];
  func: FunctionFragment;
}

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
}));

const contractBasicFunction = async ({
  address,
  abi,
  func,
}: ContractFunctionBlockProps) => {
  try {
    const [result] = await callContract(address, abi, func.name);
    return result;
  } catch (error) {}
};

const isBasicFunction = (func: FunctionFragment) => {
  return !func.inputs.length;
};

export const ContractFunctionBlock = ({
  address,
  abi,
  func,
}: ContractFunctionBlockProps) => {
  const classes = useStyles();

  useEffect(() => {
    if (isBasicFunction(func)) {
      contractBasicFunction({ address, abi, func });
    }
  }, [abi, address, func]);

  return (
    <Collapsable>
      <div className={classes.header}>
        {func.name}
        <Box flexGrow={1} />
        <Address address={"0x"} />
      </div>
    </Collapsable>
  );
};
