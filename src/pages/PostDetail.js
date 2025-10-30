import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { editPost } from "../redux/postsSlice";

export default function PostDetail() {
  const { id } = useParams();
  const post = useSelector((state) =>
    state.posts.find((p) => p.id === Number(id))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  if (!post) return <div>Post not found</div>;

  const handleSave = () => {
    dispatch(
      editPost({
        id: post.id,
        title,
        content,
        user: post.user,
        reactions: post.reactions,
      })
    );
    setIsEditing(false);
  };

  return (
    <div className="post">
      {isEditing ? (
        <>
          <input
            id="postTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            id="postContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button className="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button onClick={() => navigate("/")}>Back</button>
        </>
      )}
    </div>
  );
}
