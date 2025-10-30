import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addReaction } from "../redux/postsSlice";

export default function PostItem({ post }) {
  const dispatch = useDispatch();

  return (
    <div className="post">
      <h3>
        {post.title} by {post.user}
      </h3>
      <p>{post.content}</p>
      <div>
        {["thumbsUp", "heart", "laugh", "sad", "rocket"].map((r) => (
          <button
            key={r}
            onClick={() =>
              dispatch(addReaction({ postId: post.id, reaction: r }))
            }
          >
            {r}: {post.reactions[r]}
          </button>
        ))}
      </div>
      <Link to={`/posts/${post.id}`} className="button">
        View Details
      </Link>
    </div>
  );
}
