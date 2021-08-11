import { useCallback, useState } from "react";
import { callContract } from "../services";
import { BigNumber } from "ethers";

export type FunctionOutputs = (string | BigNumber)[];

export const useContractQuery = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FunctionOutputs>();
  const [error, setError] = useState<string | undefined>();

  const fetch = useCallback((...params: Parameters<typeof callContract>) => {
    setLoading(true);
    setResult(undefined);
    callContract(...params)
      .then((response) => {
        setResult(response);
        setError(undefined);
      })
      .catch((error) => {
        setError(error.message);
        setResult(undefined);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, result, fetch };
};
