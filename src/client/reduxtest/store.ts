import { configureStore, createSlice } from "@reduxjs/toolkit";
import { red1 } from "./red";

export const store = configureStore({
  reducer: {
    red1: red1.reducer,
  }
});