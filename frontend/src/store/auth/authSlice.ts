import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, Tokens } from "./authTypes";

// 🔐 carrega do localStorage (se existir)
const storedAuth = localStorage.getItem("auth");

const initialState: AuthState = storedAuth
  ? JSON.parse(storedAuth)
  : {
      user: null,
      tokens: null,
      isAuthenticated: false,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ user: User; tokens: Tokens }>
    ) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;

      localStorage.setItem("auth", JSON.stringify(state));
    },

    logout(state) {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },

    updateTokens(state, action: PayloadAction<Tokens>) {
      if (state.tokens) {
        state.tokens.access = action.payload.access;
        state.tokens.refresh = action.payload.refresh;

        localStorage.setItem("auth", JSON.stringify(state));
      }
    },
  },
});

export const { loginSuccess, logout, updateTokens } = authSlice.actions;
export default authSlice.reducer;
