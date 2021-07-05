import React, { useMemo } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { ContractFunctionQueryBlock } from "./ContractFunctionBlock";
import { getReadFunction } from "../../../utils/contracts";

interface ModuleListFunctionsProps {
  address: string;
  abi: string | string[];
}

export const ContractReadFunctionsList = ({
  abi,
  address,
}: ModuleListFunctionsProps) => {
  const readFunctions: FunctionFragment[] = useMemo(
    () => getReadFunction(abi),
    [abi]
  );

  return (
    <>
      {readFunctions.map((func) => (
        <ContractFunctionQueryBlock
          key={func.name}
          address={address}
          func={func}
        />
      ))}
    </>
  );
};
