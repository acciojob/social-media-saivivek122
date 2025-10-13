import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import "./../styles/App.css";

const initialUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" }, 
];

let initialPosts = [
  { id: "static-intro", title: "Welcome to GenZ", authorId: "u1", content: "Static intro post.", reactions: [0, 0, 0, 0, 0] },
  { id: "p1", title: "Hello World", authorId: "u2", content: "First post!", reactions: [1, 0, 0, 0, 0] },
];

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [users] = useState(initialUsers);

  const addPost = (newPost) => {
    const updated = [posts[0], newPost, ...posts.slice(1)];
    setPosts(updated);
  };

  const updatePost = (id, data) => {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  };

  return (
    <div className="App">
      <h1>GenZ</h1>
      <nav>
        <a href="/">Posts</a> | <a href="/users">Users</a> | <a href="/notifications">Notifications</a>
      </nav>

      <Routes>
        <Route path="/" element={<Home posts={posts} users={users} addPost={addPost} updatePost={updatePost} />} />
        <Route path="/users" element={<Users posts={posts} users={users} />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/posts/:id" element={<PostDetails posts={posts} updatePost={updatePost} users={users} />} />
      </Routes>
    </div>
  );
}

function Home({ posts, users, addPost, updatePost }) {
  return (
    <div className="home-container">
      <CreatePost users={users} onAdd={addPost} />
      <div className="posts-list">
        {posts.slice(1).map((post) => (
          <PostCard key={post.id} post={post} users={users} onUpdate={updatePost} />
        ))}
      </div>
    </div>
  );
}

function CreatePost({ users, onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(users[0]?.id || "");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newPost = { id: `p_${Date.now()}`, title, authorId: author, content, reactions: [0, 0, 0, 0, 0] };
    onAdd(newPost);
    setTitle(""); setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input id="postTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <select id="postAuthor" value={author} onChange={(e) => setAuthor(e.target.value)}>
        {users.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
      </select>
      <textarea id="postContent" value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit" className="button">Add Post</button>
    </form>
  );
}

function PostCard({ post, users, onUpdate }) {
  const navigate = useNavigate();
  const author = users.find((u) => u.id === post.authorId)?.name || "Unknown";
  const [reactions, setReactions] = useState(post.reactions || [0, 0, 0, 0, 0]);

  const inc = (i) => {
    if (i === 4) return;
    setReactions((r) => {
      const copy = [...r];
      copy[i] += 1;
      onUpdate(post.id, { reactions: copy });
      return copy;
    });
  };

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <div>by {author}</div>
      <p>{post.content}</p>
      <div>
        {reactions.map((count, i) => (
          <button key={i} onClick={() => inc(i)}>
            {i < 4 ? count : "0"}
          </button>
        ))}
        <button className="button" onClick={() => navigate(`/posts/${post.id}`)}>View</button>
      </div>
    </div>
  );
}

function PostDetails({ posts, updatePost, users }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === id);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  if (!post) return <div>Post not found</div>;

  const save = () => {
    updatePost(id, { title, content });
    setEditing(false);
    navigate("/");
  };

  return (
    <div className="post">
      {!editing ? (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button className="button" onClick={() => setEditing(true)}>Edit</button>
        </>
      ) : (
        <>
          <input id="postTitle" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea id="postContent" value={content} onChange={(e) => setContent(e.target.value)} />
          <button className="button" onClick={save}>Save</button>
        </>
      )}
    </div>
  );
}

function Users({ posts, users }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    const postsOfUser = posts.filter((p) => p.authorId === user.id);
    setUserPosts(postsOfUser);
  };

  return (
    <div>
      <ul>
        {users.map((u) => (
          <li key={u.id} onClick={() => handleSelectUser(u)}>{u.name}</li>
        ))}
      </ul>
      <ul>
        {userPosts.map((p) => (
          <li key={p.id} className="post">{p.title}</li>
        ))}
      </ul>
    </div>
  );
}

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const refresh = () => {
    setNotifications(["Notification 1", "Notification 2"]);
  };

  return (
    <div>
      <button className="button" onClick={refresh}>Refresh Notifications</button>
      <section className="notificationsList">
        {notifications.map((n, i) => <div key={i}>{n}</div>)}
      </section>
    </div>
  );
}
