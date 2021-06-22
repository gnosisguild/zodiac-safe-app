import React, { useMemo } from "react";
import { FunctionFragment, Interface } from "@ethersproject/abi";
import { ContractFunctionBlock } from "./ContractFunctionBlock";
import { isReadFunction } from "../../../utils/contracts";

interface ModuleListFunctionsProps {
  address: string;
  abi: string | string[];
}

export const ContractReadFunctionList = ({
  abi,
  address,
}: ModuleListFunctionsProps) => {
  const readFunctions: FunctionFragment[] = useMemo(() => {
    return new Interface(abi).fragments
      .filter(FunctionFragment.isFunctionFragment)
      .map(FunctionFragment.from)
      .filter(isReadFunction);
  }, [abi]);

  return (
    <>
      {readFunctions.map((func) => (
        <ContractFunctionBlock
          key={func.name}
          address={address}
          abi={abi}
          func={func}
        />
      ))}
    </>
  );
};
