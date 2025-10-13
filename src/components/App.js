import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./../styles/App.css";

export default function App() {
  return (
    <div className="App p-4">
      <Header />
      <main className="mt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/posts/:id" element={<PostDetails />} />
        </Routes>
      </main>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  const handleNav = (e, to) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <header className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">GenZ</h1>
      <nav>
        <a href="/" onClick={(e) => handleNav(e, "/")} className="mr-4">
          Posts
        </a>
        <a href="/users" onClick={(e) => handleNav(e, "/users")} className="mr-4">
          Users
        </a>
        <a href="/notifications" onClick={(e) => handleNav(e, "/notifications")} className="mr-4">
          Notifications
        </a>
      </nav>
    </header>
  );
}

const initialUsers = [
  { id: "u1", name: "Alice" },
  { id: "u2", name: "Bob" },
  { id: "u3", name: "Charlie" },
];

let initialPosts = [
  {
    id: "static-intro",
    title: "Welcome to GenZ",
    authorId: "u1",
    content: "This is a static intro (keeps position 1).",
    reactions: [0, 0, 0, 0, 0],
  },
  {
    id: "p1",
    title: "Hello World",
    authorId: "u2",
    content: "My first post",
    reactions: [1, 2, 0, 0, 0],
  },
];

function Home() {
  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);

  const addPost = (newPost) => {
    const updated = [posts[0], newPost, ...posts.slice(1)];
    setPosts(updated);
  };

  const updatePost = (id, data) => {
    setPosts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
  };

  return (
    <section>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <CreatePost users={users} onAdd={addPost} />
        </div>

        <div>
          <div className="posts-list border p-4 rounded">
            <div className="mb-4">Latest posts</div>
            {posts.slice(1).map((post) => (
              <PostCard key={post.id} post={post} users={users} onUpdate={updatePost} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatePost({ users, onAdd }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(users[0]?.id || "");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newPost = {
      id: `p_${Date.now()}`,
      title: title.trim(),
      authorId: author,
      content: content.trim(),
      reactions: [0, 0, 0, 0, 0],
    };
    onAdd(newPost);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded">
      <h2 className="text-xl font-semibold">Create Post</h2>

      <div>
        <label htmlFor="postTitle">Title</label>
        <input
          id="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border p-2 mt-1"
        />
      </div>

      <div>
        <label htmlFor="postAuthor">Author</label>
        <select
          id="postAuthor"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="block w-full border p-2 mt-1"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="postContent">Content</label>
        <textarea
          id="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="block w-full border p-2 mt-1"
        />
      </div>

      <button type="submit" className="button px-4 py-2 rounded bg-slate-200">
        Add Post
      </button>
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
      copy[i] = copy[i] + 1;
      onUpdate(post.id, { reactions: copy });
      return copy;
    });
  };

  return (
    <article className="post border p-3 mb-3 rounded">
      <h3 className="font-semibold">{post.title}</h3>
      <div className="text-sm text-gray-600">by {author}</div>
      <p className="mt-2">{post.content}</p>

      <div className="mt-3 flex items-center gap-2">
        {reactions.map((count, i) => (
          <button key={i} className="px-2 py-1 border rounded" onClick={() => inc(i)}>
            {i < 4 ? `${count}` : `0`}
          </button>
        ))}

        <button
          className="button ml-auto px-3 py-1 border rounded"
          onClick={() => navigate(`/posts/${post.id}`)}
        >
          View
        </button>
      </div>
    </article>
  );
}

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(initialPosts);
  const post = posts.find((p) => p.id === id) || null;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  const save = () => {
    const updated = posts.map((p) => (p.id === id ? { ...p, title, content } : p));
    initialPosts = updated;
    setPosts(updated);
    setEditing(false);
    navigate("/");
  };

  if (!post) return <div className="p-4">Post not found</div>;

  return (
    <div className="p-4 border rounded max-w-2xl">
      <div className="post">
        {!editing ? (
          <>
            <h2 className="text-2xl font-bold">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
            <div className="mt-4">
              <button className="button px-3 py-1 border rounded" onClick={() => setEditing(true)}>
                Edit
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div>
              <label htmlFor="postTitle">Title</label>
              <input
                id="postTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full border p-2 mt-1"
              />
            </div>

            <div>
              <label htmlFor="postContent">Content</label>
              <textarea
                id="postContent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full border p-2 mt-1"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={save} className="px-3 py-1 rounded border button">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Users() {
  const [users] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    const posts = initialPosts.filter((p) => p.authorId === user.id);
    setUserPosts(posts);
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <h2 className="font-semibold">All Users</h2>
        <ul>
          {users.map((u) => (
            <li key={u.id} onClick={() => handleSelectUser(u)} className="cursor-pointer">
              {u.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">User Posts</h3>
        <ul>
          {userPosts.map((p) => (
            <li key={p.id} onClick={() => setUserPosts([p])} className="cursor-pointer">
              {p.title}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {userPosts.length === 1 && (
          <article className="post border p-3 rounded">
            <h4>{userPosts[0].title}</h4>
            <p>{userPosts[0].content}</p>
          </article>
        )}
      </div>
    </div>
  );
}

function Notifications() {
  const [notes, setNotes] = useState([]);

  const refresh = () => {
    setNotes([
      { id: 1, text: "Alice reacted to your post" },
      { id: 2, text: "Bob commented" },
    ]);
  };

  return (
    <div>
      <h2 className="font-semibold">Notifications</h2>
      <button className="button" onClick={refresh}>
        Refresh Notifications
      </button>

      <section className="notificationsList mt-4">
        {notes.length === 0 ? null : (
          <div>
            {notes.map((n) => (
              <div key={n.id}>{n.text}</div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
