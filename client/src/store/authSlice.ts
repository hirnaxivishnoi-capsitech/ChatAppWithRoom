import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from ".";

interface AuthState {
  name: string;
  email: string;
  token: string;
  id: string;
}

const initialState: AuthState = {
  name: "",
  email: "",
  token: "",
  id: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setUserData: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
    // updateUserData: (state, action) => {
      
    //   state.id = action.payload.id;
    //   state.name = action.payload.name;
    //   state.email = action.payload.email;
    // },
    clearUserData: () => {
      return initialState;
    },
  },
});

export const token = (state: RootState): string => state?.auth?.token;
export const userData = (state: RootState): AuthState => state?.auth;

export const { setUserData, clearUserData } = authSlice.actions;
export default authSlice.reducer;
