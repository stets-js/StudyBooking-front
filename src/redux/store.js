import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import managerReducer from './manager/manager-reducers';
import callerReducer from './caller/caller-reducers';
import confirmatorReducer from "./confirmator/confirmator-reducers";
import avaliableReducer from "./confirmator/avaliable-reducers";
import authReducer from "./auth-reducers";

const persistConfig = {
  key: "booking-system",
  storage,
  // blacklist: ['token'],
};

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedReducer = persistReducer(persistConfig, combineReducers({
  auth: authReducer,
  manager: managerReducer,
  caller: callerReducer,
  confirmator: confirmatorReducer,
  avaliable: avaliableReducer,
}));

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
// export const persistor = persistStore(store);
