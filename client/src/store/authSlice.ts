import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  name: string;
  email: string;
  token: string;
  id: string;
}

const initialState: AuthState = {
  name:'',
  email:'',
  token:'',
  id:''
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
   setUserData : (state, action) => {
    state.name = action.payload.name
    state.email = action.payload.email
    state.token = action.payload.token
    state.id = action.payload.id
    },
    clearUserData: () => {
      return initialState; 
    }
  },
})

export const { setUserData, clearUserData } = authSlice.actions
export default authSlice.reducer