import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import persistStore from "redux-persist/es/persistStore";

const encryptor = encryptTransform({
  secretKey: `${import.meta.env.REACT_APP_SECERT_KEY}`,
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

const saveToSessionStorage = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem("state", serializedState);
  } catch (e) {
    console.log(e);
  }
};
 
store.subscribe(() => saveToSessionStorage(store.getState()));
 

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
