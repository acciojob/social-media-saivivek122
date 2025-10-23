import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, Link, useNavigate } from "react-router-dom";

const App = () => { 

  const initialUsers = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  const initialPosts = [
    { id: 1, title: "First Post", author: "Alice", content: "Hello World", reactions: [0,0,0,0,0] },
    { id: 2, title: "Second Post", author: "Bob", content: "React is cool!", reactions: [0,0,0,0,0] },
  ];

  const [users] = useState(initialUsers);
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const addPost = (post) => {
    setPosts([{ id: posts.length + 1, reactions: [0,0,0,0,0], ...post }, ...posts]);
  };

  const updatePost = (updated) => {
    setPosts(posts.map(p => p.id === updated.id ? updated : p));
  };

  const reactToPost = (postId, index) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const newReactions = [...p.reactions];
        newReactions[index]++;
        return { ...p, reactions: newReactions };
      }
      return p;
    }));
  };

  const refreshNotifications = () => {
    setNotifications(["New comment!", "Post liked!", "New follower!"]);
  };

  const LandingPage = () => (
    <div>
      <h2>All Posts</h2>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.title}</h3>
            <p><b>Author:</b> {post.author}</p>
            <p>{post.content}</p>
            <div>
              {post.reactions.map((r, i) => (
                <button key={i} onClick={() => reactToPost(post.id, i)}>
                  {i < 4 ? `❤️ ${r}` : `🚫 0`}
                </button>
              ))}
            </div>
            <button onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );

  const UsersPage = () => (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>

      <Routes>
        <Route path=":id" element={<UserPosts />} />
      </Routes>
    </div>
  );

  const UserPosts = () => {
    const { id } = useParams();
    const user = users.find(u => u.id === parseInt(id));
    const userPosts = posts.filter(p => p.author === user.name);
    return (
      <div>
        <h3>Posts by {user.name}</h3>
        {userPosts.map(p => (
          <div key={p.id} className="post">
            <h4>{p.title}</h4>
            <p>{p.content}</p>
          </div>
        ))}
      </div>
    );
  };

  const NotificationsPage = () => (
    <div>
      <h2>Notifications</h2>
      <button className="button" onClick={refreshNotifications}>Refresh Notifications</button>
      <section className="notificationsList">
        {notifications.map((n, i) => <div key={i}>{n}</div>)}
      </section>
    </div>
  );

  const CreatePostPage = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState(users[0].name);
    const [content, setContent] = useState("");

    const handleSubmit = () => {
      addPost({ title, author, content });
      navigate("/");
    };

    return (
      <div>
        <h2>Create Post</h2>
        <input id="postTitle" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <select id="postAuthor" value={author} onChange={e => setAuthor(e.target.value)}>
          {users.map(u => <option key={u.id}>{u.name}</option>)}
        </select>
        <textarea id="postContent" placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  };

  const EditPostPage = () => {
    const { id } = useParams();
    const post = posts.find(p => p.id === parseInt(id));
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);

    const handleSave = () => {
      updatePost({ ...post, title, content });
      navigate("/");
    };

    return (
      <div className="post">
        <h2>Edit Post</h2>
        <input id="postTitle" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea id="postContent" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={handleSave}>Save</button>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>GenZ</h1>
      <nav>
        <Link to="/">Posts</Link> | 
        <Link to="/users">Users</Link> | 
        <Link to="/notifications">Notifications</Link> | 
        <Link to="/create">Create Post</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/users/*" element={<UsersPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/create" element={<CreatePostPage />} />
        <Route path="/edit/:id" element={<EditPostPage />} />
      </Routes>
    </div>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
