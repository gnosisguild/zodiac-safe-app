import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { Module, ModulesState, ModuleType, Operation } from "./models";
import { fetchSafeModulesAddress, fetchSafeTransactions } from "../../services";
import { isMultiSendDataEncoded, sanitizeModule } from "./helpers";

const {
  REACT_APP_MODULE_FACTORY_PROXY: MODULE_FACTORY_PROXY,
  REACT_APP_DAO_MODULE_MASTER_COPY: DAO_MODULE_MASTER_COPY,
} = process.env;

const initialModulesState: ModulesState = {
  operation: "read",
  reloadCount: 0,
  loadingModules: false,
  list: [],
  current: undefined,
  pendingModules: [],
};

export const fetchModulesList = createAsyncThunk(
  "modules/fetchModulesList",
  async ({
    safeSDK,
    safeAddress,
    chainId,
  }: {
    safeSDK: SafeAppsSDK;
    chainId: number;
    safeAddress: string;
  }): Promise<Module[]> => {
    const moduleAddresses = await fetchSafeModulesAddress(safeAddress);
    const requests = moduleAddresses.map(
      async (m) => await sanitizeModule(m, safeSDK, chainId)
    );
    requests.reverse();
    return await Promise.all(requests);
  }
);

export const fetchPendingModules = createAsyncThunk(
  "modules/fetchPendingModules",
  async ({
    safeAddress,
    chainId,
  }: {
    chainId: number;
    safeAddress: string;
  }) => {
    const transactions = await fetchSafeTransactions(chainId, safeAddress);
    try {
      const isDaoModuleTxPending = transactions.some(
        (safeTransaction) =>
          isMultiSendDataEncoded(safeTransaction.dataDecoded) &&
          safeTransaction.dataDecoded.parameters[0].valueDecoded.some(
            (transaction) =>
              transaction.to.toLowerCase() === MODULE_FACTORY_PROXY &&
              transaction.dataDecoded &&
              transaction.dataDecoded.method === "deployModule" &&
              transaction.dataDecoded.parameters.some(
                (param) =>
                  param.name === "masterCopy" &&
                  param.value.toLowerCase() === DAO_MODULE_MASTER_COPY
              )
          )
      );

      console.log({ isDaoModuleTxPending });

      if (isDaoModuleTxPending) {
        return [ModuleType.DAO];
      }
    } catch (errpr) {
      console.log("err", errpr);
    }
    return [];
  }
);

export const modulesSlice = createSlice({
  name: "modules",
  initialState: initialModulesState,
  reducers: {
    increaseReloadCount: (state) => {
      state.reloadCount += 1;
    },
    setModules(state, action: PayloadAction<Module[]>) {
      state.list = action.payload;
    },
    setCurrentModule(state, action: PayloadAction<Module>) {
      state.current = action.payload;
      state.operation = "read";
    },
    unsetCurrentModule(state) {
      state.current = undefined;
    },
    setOperation(state, action: PayloadAction<Operation>) {
      state.operation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModulesList.pending, (state) => {
      state.loadingModules = true;
    });
    builder.addCase(fetchModulesList.rejected, (state) => {
      state.loadingModules = false;
    });
    builder.addCase(fetchModulesList.fulfilled, (state, action) => {
      state.loadingModules = false;
      state.list = action.payload;
    });
    builder.addCase(fetchPendingModules.fulfilled, (state, action) => {
      state.pendingModules = action.payload;
    });
  },
});

export const {
  increaseReloadCount,
  setCurrentModule,
  setModules,
  unsetCurrentModule,
  setOperation,
} = modulesSlice.actions;
