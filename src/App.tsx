import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Loader, Title } from "@gnosis.pm/safe-react-components";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import {
  disableModule,
  enableModule,
  fetchModules,
  addModule,
  editModule,
} from "services";

const Container = styled.form`
  margin-bottom: 2rem;
  width: 100%;
  max-width: 480px;

  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const [submitting, setSubmitting] = useState(false);

  // const safeModules = await modules.fetchModules(safe.safeAddress);
  // console.log(safeModules);
  // const transactions = modules.edit(
  //   "dao",
  //   "0xA04EAC970D550C6717822Ff07d075C07A0d01586",
  //   {
  //     setMinimumBond: "10000000",
  //     setQuestionCooldown: "100000",
  //   }
  // );

  const disable = useCallback(async () => {
    const transactions = await disableModule(
      safe.safeAddress,
      "0x327F67C24D1F24fcE614ae8a6D7309bf8736C8B3"
    );

    setSubmitting(true);
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [transactions],
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  }, [safe, sdk]);

  const fetch = useCallback(async () => {
    const safeModules = await fetchModules(safe.safeAddress);
    console.log(safeModules);
  }, [safe, sdk]);

  const enable = useCallback(async () => {
    try {
      const transactions = await enableModule(
        safe.safeAddress,
        "0xA04EAC970D550C6717822Ff07d075C07A0d01586"
      );
      const { safeTxHash } = await sdk.txs.send({
        txs: [transactions],
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });
    } catch (e) {
      console.error(e);
    }
  }, [safe, sdk]);

  return (
    <Container>
      <Title size="md">{safe.safeAddress}</Title>
      {submitting ? (
        <>
          <Loader size="md" />
          <br />
          <Button
            size="lg"
            color="secondary"
            onClick={() => {
              setSubmitting(false);
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button size="lg" color="primary" onClick={disable}>
            Disable module
          </Button>
          <Button size="lg" color="primary" onClick={fetch}>
            Fetch modules
          </Button>
          <Button size="lg" color="primary" onClick={enable}>
            Enable modules
          </Button>
        </>
      )}
    </Container>
  );
};

export default App;
