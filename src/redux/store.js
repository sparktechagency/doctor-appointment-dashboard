import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./features/auth/authSlice";
import { baseApi } from "./baseApi/baseApi";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import socketReducer from "./features/socket/socketSlice";
import { teamApi } from "./features/product/teamApi";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"],
};

const socketPersistConfig = {
  key: "socket",
  storage,
  blacklist: ['socketId'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  socket: persistReducer(socketPersistConfig, socketReducer),
  [baseApi.reducerPath]: baseApi.reducer,
  [teamApi.reducerPath]: teamApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['socket.socketId']
      },
    }).concat(
      baseApi.middleware,
      teamApi.middleware
    ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);