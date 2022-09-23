import { configureStore } from "@reduxjs/toolkit";
import { modulesSlice } from "./modules";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { transactionBuilderSlice } from "./transactionBuilder";
import { modulesMiddleware } from "./modules/middleware";
import { transactionBuilderMiddleware } from "./transactionBuilder/middleware";

export const REDUX_STORE = configureStore({
  reducer: {
    modules: modulesSlice.reducer,
    transactionBuilder: transactionBuilderSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      modulesMiddleware,
      transactionBuilderMiddleware
    ),
});

export type RootState = ReturnType<typeof REDUX_STORE.getState>;
export type AppDispatch = typeof REDUX_STORE.dispatch;

export const useRootDispatch = () => useDispatch<AppDispatch>();
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;
