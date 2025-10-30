import React from "react";
import { useSelector } from "react-redux";
import PostItem from "./PostItem";

export default function PostsList() {
  const posts = useSelector((state) => state.posts);

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}
