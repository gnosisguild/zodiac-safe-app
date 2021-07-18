import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRootDispatch } from "store";
import { fetchModulesList } from "store/modules";

export const useFetchTransaction = (onClose?: () => void) => {
  const { sdk, safe } = useSafeAppsSDK();
  const dispatch = useRootDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [safeHash, setSafeHash] = useState<string>();
  const [loadMessage, setLoadMessage] = useState<string>(
    "Please confirm your transaction"
  );
  const [safeTxSuccessful, setSafeTxSuccessful] = useState<boolean>(false);

  useEffect(() => {
    const setService = async () => {
      await sdk.txs.setTxServiceUrl(
        "https://safe-transaction.rinkeby.staging.gnosisdev.com/api/v1"
      );
    };

    setService();
  }, [sdk]);

  const getSafeTransaction = useCallback(async () => {
    if (safeHash) {
      if (loadMessage === "Please confirm your transaction") {
        setLoadMessage("Confirming safe transaction...");
      }

      const safeTx = await sdk.txs.getBySafeTxHash(safeHash);

      if (safeTx.isSuccessful) {
        setSafeTxSuccessful(true);
        setSafeHash(undefined);
        setLoading(false);
        onClose && onClose();
        dispatch(
          fetchModulesList({
            safeSDK: sdk,
            chainId: safe.chainId,
            safeAddress: safe.safeAddress,
          })
        );
        return safeTx;
      }
    }
  }, [safeHash, sdk]);

  useQuery("fetchSafeTx", getSafeTransaction, {
    enabled: !!safeHash && !safeTxSuccessful,
    refetchInterval: 1000,
  });

  return {
    loading,
    loadMessage,
    safeTxSuccessful,
    safeHash,
    setSafeTxSuccessful,
    setLoadMessage,
    setLoading,
    setSafeHash,
  };
};
