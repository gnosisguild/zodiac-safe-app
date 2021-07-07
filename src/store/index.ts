import { configureStore } from "@reduxjs/toolkit";
import { modulesSlice } from "./modules";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const REDUX_STORE = configureStore({
  reducer: {
    modules: modulesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof REDUX_STORE.getState>;
export type AppDispatch = typeof REDUX_STORE.dispatch;

export const useRootDispatch = () => useDispatch<AppDispatch>();
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;
