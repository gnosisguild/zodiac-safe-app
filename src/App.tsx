import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Button, Loader, Title } from "@gnosis.pm/safe-react-components";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { buildAction2, buildMultiSendSafeTx } from "./services/helpers";
import { Contract } from "ethers";
import { ModuleManager } from "services/Module";

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

  const simpleStorage = new Contract(
    "0x91632e5058e71ef3805DAFC3f4904abE2A4BF524",
    ["function set(uint256 x) public"]
  );

  const modules = new ModuleManager();

  // User wants to deploy + add module to Safe
  // User wants to enable/disable modules
  // User wants to edit attributes from

  /* 
  modules.deployAndEnable("dao", paramsOfConstructor)
  modules.enable(address)
  modules.disable(address)
  modules.edit("dao", paramsToEdit)
  */

  const data = simpleStorage.interface.encodeFunctionData("set", [10]);
  const a = buildAction2(simpleStorage, "set", [10]);
  const submitTx = useCallback(async () => {
    setSubmitting(true);
    // sdk.txs.send({
    //   txs: [a],
    // });
    try {
      const { safeTxHash } = await sdk.txs.send({
        txs: [
          {
            to: simpleStorage.address,
            value: "0",
            data,
          },
        ],
      });
      console.log({ safeTxHash });
      const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
      console.log({ safeTx });
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
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
        <Button size="lg" color="primary" onClick={submitTx}>
          Submit
        </Button>
      )}
    </Container>
  );
};

export default App;
