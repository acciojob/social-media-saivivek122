import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: [],
  reducers: {
    setNotifications: () => [
      "Notification 1",
      "Notification 2",
      "Notification 3",
    ],
  },
});

export const { setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
