import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authPendingState: (state) => {
      state.isLoading = true;
      state.isError = false;
    },
    authFulfilledState: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.user = action.payload;
    },
    authRejectedState: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    },
  },
});

export const { authPendingState, authRejectedState, authFulfilledState } =
  authSlice.actions;
export default authSlice.reducer;
