import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  booga: 1,
  foo: 'bar',
}

export const red1 = createSlice({
  name: "red1",
  initialState,
  reducers: {
    boo: (state) => {
      state.booga++;
    },
    fo: (state, v) => {
      state.foo = v.payload;
    }
  },
})

export const { boo, fo } = red1.actions;

export default red1.reducer;