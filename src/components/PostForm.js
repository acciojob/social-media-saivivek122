import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../redux/postsSlice";

export default function PostForm() {
  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !user || !content) return;
    dispatch(
      addPost({
        id: Date.now(),
        title,
        user,
        content,
        reactions: { thumbsUp: 0, heart: 0, laugh: 0, sad: 0, rocket: 0 },
      })
    );
    setTitle("");
    setUser("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        id="postTitle"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        id="postAuthor"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      >
        <option value="">Select Author</option>
        {users.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
      <textarea
        id="postContent"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Add Post</button>
    </form>
  );
}
