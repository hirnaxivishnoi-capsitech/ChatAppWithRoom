import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import persistStore from "redux-persist/es/persistStore";

const encryptor = encryptTransform({
  secretKey: 'your-super-secret-key',
  onError: function (error) {
    console.error('Encryption/Decryption Error:', error);
  },
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
