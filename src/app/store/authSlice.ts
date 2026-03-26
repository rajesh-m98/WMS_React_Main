import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserDTO } from "@/core/models/master.model";

export type UserData = UserDTO;

interface AuthState {
  token: string | null;
  refresh_token: string | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isTokenExpired: boolean;
  loading: boolean;
  error: string | null;
  // Login UI Form State
  loginForm: {
    username: string;
    password: string;
    showPassword: boolean;
  };
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  refresh_token: localStorage.getItem('refresh_token'),
  userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')!) : null,
  isAuthenticated: !!localStorage.getItem('token'),
  isTokenExpired: false,
  loading: false,
  error: null,
  loginForm: {
    username: "",
    password: "",
    showPassword: false,
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Form handlers
    updateLoginForm: (state, action: PayloadAction<{ field: 'username' | 'password'; value: string }>) => {
      state.loginForm[action.payload.field] = action.payload.value;
    },
    togglePasswordVisibility: (state) => {
      state.loginForm.showPassword = !state.loginForm.showPassword;
    },
    clearLoginForm: (state) => {
      state.loginForm.username = "";
      state.loginForm.password = "";
      state.loginForm.showPassword = false;
    },

    // Auth Lifecycle Handlers
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ access_token: string; refresh_token: string; userData: UserData }>) => {
      state.loading = false;
      state.token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
      state.isTokenExpired = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    setSignIn: (state, action: PayloadAction<{ token: string; refresh_token?: string; userData: UserData }>) => {
      state.token = action.payload.token;
      state.refresh_token = action.payload.refresh_token || null;
      state.userData = action.payload.userData;
      state.isAuthenticated = true;
      state.isTokenExpired = false;
      localStorage.setItem('token', action.payload.token);
      if (action.payload.refresh_token) localStorage.setItem('refresh_token', action.payload.refresh_token);
      localStorage.setItem('userData', JSON.stringify(action.payload.userData));
    },
    setSignOut: (state) => {
      state.token = null;
      state.refresh_token = null;
      state.userData = null;
      state.isAuthenticated = false;
      state.isTokenExpired = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userData');
    },
    setTokenExpired: (state) => {
      state.isTokenExpired = true;
      state.isAuthenticated = false;
      state.token = null;
      state.refresh_token = null;
    },
  },
});

export const { 
  updateLoginForm, 
  togglePasswordVisibility, 
  clearLoginForm,
  loginStart,
  loginSuccess,
  loginFailure,
  setSignIn, 
  setSignOut, 
  setTokenExpired 
} = authSlice.actions;

export default authSlice.reducer;
