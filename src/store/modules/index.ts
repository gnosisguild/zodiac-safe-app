import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Module, ModulesState } from "./models";
import { fetchSafeModulesAddress } from "../../services";
import { fetchContractSourceCode } from "../../utils/contracts";

const initialModulesState: ModulesState = {
  reloadCount: 0,
  loadingModules: false,
  list: [],
  current: undefined,
};

export const fetchModulesList = createAsyncThunk(
  "modules/fetchModulesList",
  async ({
    safeAddress,
    chainId,
  }: {
    chainId: number;
    safeAddress: string;
  }): Promise<Module[]> => {
    // @TODO: Create a sanitize function which retrieve the subModules
    const moduleAddress = await fetchSafeModulesAddress(safeAddress);
    const requests = moduleAddress.map(async (module): Promise<Module> => {
      let name = "Unknown";
      try {
        const sourceCode = await fetchContractSourceCode(chainId, module);
        name = sourceCode.ContractName;
      } catch (error) {
        console.log("unable to fetch source code");
      }
      return {
        name,
        address: module,
        subModules: [],
      };
    });

    return await Promise.all(requests);
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
    },
    unsetCurrentModule(state) {
      state.current = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModulesList.pending, (state) => {
      state.loadingModules = true;
    });
    builder.addCase(fetchModulesList.rejected, (state, action) => {
      state.loadingModules = false;
    });
    builder.addCase(fetchModulesList.fulfilled, (state, action) => {
      state.loadingModules = false;
      state.list = action.payload;
    });
  },
});

export const {
  increaseReloadCount,
  setCurrentModule,
  setModules,
  unsetCurrentModule,
} = modulesSlice.actions;
