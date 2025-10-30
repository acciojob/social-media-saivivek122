import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: [
    {
      id: 1,
      title: "First Post",
      user: "Alice",
      content: "Hello world!",
      reactions: { thumbsUp: 0, heart: 0, laugh: 0, sad: 0, rocket: 0 },
    },
  ],
  reducers: {
    addPost: (state, action) => {
      state.push(action.payload);
    },
    editPost: (state, action) => {
      const index = state.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) state[index] = action.payload;
    },
    addReaction: (state, action) => {
      const { postId, reaction } = action.payload;
      const post = state.find((p) => p.id === postId);
      if (post && reaction !== "rocket") post.reactions[reaction]++;
    },
  },
});

export const { addPost, editPost, addReaction } = postsSlice.actions;
export default postsSlice.reducer;
