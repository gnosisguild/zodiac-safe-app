import { Middleware } from "@reduxjs/toolkit";
import { setCurrentModule } from "../modules";
import { closeTransactionBuilder } from "./index";

export const transactionBuilderMiddleware: Middleware =
  (store) => (next) => (action) => {
    if (action.type === setCurrentModule.type) {
      store.dispatch(closeTransactionBuilder());
    }
    return next(action);
  };
