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
    // Update user
    updatePending: (state) => {
      state.isLoading = true;
      state.isError = null;
    },
    updateFulFilled: (state, action) => {
      state.user = action.payload;
      state.isLoading = false;
      state.isError = null;
    },
    updateRejected: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    },
    deletePending: (state) => {
      state.isLoading = true;
      state.isError = null;
    },
    deleteFulFilled: (state) => {
      state.isLoading = false;
      state.user = null;
      state.isError = null;
    },
    deleteRejected: (state, action) => {
      state.isError = action.payload;
      state.isLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isError = null;
      state.isLoading = false;
    },
  },
});

export const {
  authPendingState,
  authRejectedState,
  authFulfilledState,
  updateFulFilled,
  updatePending,
  updateRejected,
  logoutUser,
  deletePending,
  deleteFulFilled,
  deleteRejected,
} = authSlice.actions;
export default authSlice.reducer;
