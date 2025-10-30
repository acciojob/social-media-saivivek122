import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: ["Alice", "Bob", "Charlie"],
});

export default usersSlice.reducer;
