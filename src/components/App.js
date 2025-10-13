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
    <div>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">GenZ</h1>
        <nav>
          <Link to="/" className="mr-4">Posts</Link>
          <Link to="/users" className="mr-4">Users</Link>
          <Link to="/notifications" className="mr-4">Notifications</Link>
        </nav>
      </header>

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
    <div className="mt-6 grid grid-cols-2 gap-6">
      <CreatePost users={users} onAdd={addPost} />
      <div className="posts-list border p-4 rounded">
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
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      <input id="postTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="block w-full border p-2" />
      <select id="postAuthor" value={author} onChange={(e) => setAuthor(e.target.value)} className="block w-full border p-2">
        {users.map((u) => (<option key={u.id} value={u.id}>{u.name}</option>))}
      </select>
      <textarea id="postContent" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="block w-full border p-2" />
      <button type="submit" className="button px-4 py-2 rounded bg-slate-200">Add Post</button>
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
    <article className="post border p-3 mb-3 rounded">
      <h3>{post.title}</h3>
      <div className="text-sm text-gray-600">by {author}</div>
      <p>{post.content}</p>
      <div className="mt-3 flex items-center gap-2">
        {reactions.map((count, i) => (
          <button key={i} className="px-2 py-1 border rounded" onClick={() => inc(i)}>
            {i < 4 ? `${count}` : "0"}
          </button>
        ))}
        <button className="button ml-auto px-3 py-1 border rounded" onClick={() => navigate(`/posts/${post.id}`)}>View</button>
      </div>
    </article>
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
    <div className="p-4 border rounded max-w-2xl">
      {!editing ? (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button className="button px-3 py-1 border rounded mt-2" onClick={() => setEditing(true)}>Edit</button>
        </>
      ) : (
        <>
          <input id="postTitle" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full border p-2 mt-1" />
          <textarea id="postContent" value={content} onChange={(e) => setContent(e.target.value)} className="block w-full border p-2 mt-1" />
          <button onClick={save} className="button px-3 py-1 border rounded mt-2">Save</button>
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
    <div className="grid grid-cols-3 gap-6">
      <ul>
        {users.map((u) => (
          <li key={u.id} onClick={() => handleSelectUser(u)} className="cursor-pointer">{u.name}</li>
        ))}
      </ul>
      <ul>
        {userPosts.map((p) => (
          <li key={p.id}>{p.title}</li>
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
