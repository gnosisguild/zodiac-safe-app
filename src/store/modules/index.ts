import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import {
  Module,
  ModuleOperation,
  ModulesState,
  ModuleType,
  Operation,
  PendingModule,
} from "./models";
import {
  fetchSafeInfo,
  fetchSafeModulesAddress,
  fetchSafeTransactions,
} from "../../services";
import {
  getModulesToBeRemoved,
  isSafeAddModuleTransactionPending,
  isSafeEnableModuleTransactionPending,
  sanitizeModule,
} from "./helpers";
import { getModulesList } from "./selectors";
import { RootState } from "../index";

const initialModulesState: ModulesState = {
  operation: "read",
  reloadCount: 0,
  safeThreshold: 1,
  loadingModules: true,
  list: [],
  current: undefined,
  pendingModules: [],
  pendingRemoveModules: [],
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

    const requests = moduleAddresses.map(async (moduleAddress) => {
      try {
        return await sanitizeModule(moduleAddress, safeSDK, chainId);
      } catch (error) {
        console.log("error sanitizing module", moduleAddress);
      }
    });
    requests.reverse();
    const responses = await Promise.all(requests);
    return responses.filter((module): module is Module => module !== undefined);
  }
);

export const fetchPendingModules = createAsyncThunk(
  "modules/fetchPendingModules",
  async (
    {
      safeAddress,
      chainId,
    }: {
      chainId: number;
      safeAddress: string;
    },
    store
  ) => {
    const safeInfo = await fetchSafeInfo(chainId, safeAddress);
    const transactions = await fetchSafeTransactions(chainId, safeAddress, {
      nonce__gte: safeInfo.nonce.toString(),
    });

    const state = store.getState() as RootState;
    const modules = getModulesList(state);

    const isDaoModuleTxPending = transactions.some((safeTransaction) =>
      isSafeAddModuleTransactionPending(safeTransaction, chainId, "dao")
    );
    const isDelayModuleTxPending = transactions.some((safeTransaction) =>
      isSafeAddModuleTransactionPending(safeTransaction, chainId, "delay")
    );
    const isCustomModuleTxPending = transactions.some((safeTransaction) =>
      isSafeEnableModuleTransactionPending(safeTransaction, safeAddress)
    );

    const pendingRemoveModules = getModulesToBeRemoved(
      transactions,
      safeAddress
    );
    const removeModuleTypes: ModuleType[] = pendingRemoveModules.map(
      (moduleAddress) => {
        const current = modules.find(
          (module) => module.address === moduleAddress
        );
        if (!current) return ModuleType.UNKNOWN;
        return current.type;
      }
    );

    const isDaoModuleRemoveTxPending = removeModuleTypes.includes(
      ModuleType.DAO
    );
    const isDelayModuleRemoveTxPending = removeModuleTypes.includes(
      ModuleType.DELAY
    );
    const isUnknownModuleRemoveTxPending = removeModuleTypes.includes(
      ModuleType.UNKNOWN
    );

    const pendingModules: PendingModule[] = [];

    if (isDaoModuleTxPending) {
      pendingModules.push({
        operation: ModuleOperation.CREATE,
        module: ModuleType.DAO,
      });
    }

    if (isDelayModuleTxPending) {
      pendingModules.push({
        operation: ModuleOperation.CREATE,
        module: ModuleType.DELAY,
      });
    }

    if (isCustomModuleTxPending) {
      pendingModules.push({
        operation: ModuleOperation.CREATE,
        module: ModuleType.UNKNOWN,
      });
    }

    if (isDaoModuleRemoveTxPending) {
      pendingModules.push({
        operation: ModuleOperation.REMOVE,
        module: ModuleType.DAO,
      });
    }

    if (isDelayModuleRemoveTxPending) {
      pendingModules.push({
        operation: ModuleOperation.REMOVE,
        module: ModuleType.DELAY,
      });
    }

    if (isUnknownModuleRemoveTxPending) {
      pendingModules.push({
        operation: ModuleOperation.REMOVE,
        module: ModuleType.UNKNOWN,
      });
    }

    return { safeInfo, pendingModules, pendingRemoveModules };
  }
);

export const modulesSlice = createSlice({
  name: "modules",
  initialState: initialModulesState,
  reducers: {
    increaseReloadCount: (state) => {
      state.reloadCount += 1;
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
    builder.addCase(fetchModulesList.rejected, (state) => {
      state.loadingModules = false;
    });
    builder.addCase(fetchModulesList.fulfilled, (state, action) => {
      state.loadingModules = false;
      state.list = action.payload;
      const current = state.current;
      if (current) {
        // Check if current module got removed
        const isPresent = action.payload.some(
          (module) => module.address === current.address
        );
        if (!isPresent) {
          state.current = undefined;
        }
      }
    });
    builder.addCase(fetchPendingModules.fulfilled, (state, action) => {
      const { safeInfo, pendingModules, pendingRemoveModules } = action.payload;
      state.safeThreshold = safeInfo.threshold;
      state.pendingModules = pendingModules;
      state.pendingRemoveModules = pendingRemoveModules;
    });
  },
});

export const {
  increaseReloadCount,
  setCurrentModule,
  unsetCurrentModule,
  setOperation,
} = modulesSlice.actions;
