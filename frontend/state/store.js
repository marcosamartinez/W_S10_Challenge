import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "./ordersSlice";

export const resetStore = () =>
  configureStore({
    reducer: {
      orders: ordersReducer,
    },
  });
