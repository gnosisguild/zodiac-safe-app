import React, { useMemo } from "react";
import { FunctionFragment } from "@ethersproject/abi";
import { ContractFunctionQueryBlock } from "./ContractFunctionQueryBlock";
import { getReadFunction } from "../../../utils/contracts";
import { ContractFunctionPreviewBlock } from "./ContractFunctionPreviewBlock";
import { ABI } from "../../../store/modules/models";

type ModuleListFunctionsProps = {
  address: string;
  abi: ABI;
  preview?: boolean;
};

export const ContractReadFunctionsList = ({
  abi,
  address,
  preview,
}: ModuleListFunctionsProps) => {
  const readFunctions: FunctionFragment[] = useMemo(
    () => getReadFunction(abi),
    [abi]
  );

  return (
    <>
      {readFunctions.map((func) => {
        if (preview) {
          return <ContractFunctionPreviewBlock key={func.name} func={func} />;
        }

        return (
          <ContractFunctionQueryBlock
            key={func.name}
            address={address}
            func={func}
          />
        );
      })}
    </>
  );
};
