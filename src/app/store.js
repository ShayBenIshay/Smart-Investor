import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { smartInvestorApiSlice } from "./api/smartInvestorApiSlice";
import authReducer from "../features/auth/authSlice";
import { polygonApiSlice } from "./api/polygonApiSlice";
import portfolioReducer from "../features/portfolio/portfolioSlice";

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    [smartInvestorApiSlice.reducerPath]: smartInvestorApiSlice.reducer,
    auth: authReducer,
    [polygonApiSlice.reducerPath]: polygonApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(smartInvestorApiSlice.middleware)
      .concat(polygonApiSlice.middleware),
  devTools: process.env.NODE_ENV !== "development",
});

setupListeners(store.dispatch);
