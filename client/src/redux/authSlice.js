import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  isError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authPendingState: (state) => {
      state.isLoading = true;
      state.isError = null;
    },
    authFulfilledState: (state, action) => {
      state.isLoading = false;
      state.isError = null;
      state.user = action.payload;
    },
    authRejectedState: (state, action) => {
      state.isError = action.payload;
      state.isLoading = false;
    },
  },
});

export const { authPendingState, authRejectedState, authFulfilledState } =
  authSlice.actions;
export default authSlice.reducer;
