import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import "./../styles/App.css";

export default function App() {
  const [posts, setPosts] = useState([
    { id: 1, title: "Hello World", author: "User1", content: "This is first post", reactions: [0,0,0,0,0] },
    { id: 2, title: "Second Post", author: "User2", content: "Another post content", reactions: [0,0,0,0,0] },
  ]);

  const [notifications, setNotifications] = useState([]);
  const [users] = useState(["User1", "User2", "User3"]);
  const navigate = useNavigate();

  const addPost = (e) => {
    e.preventDefault();
    const title = e.target.postTitle.value;
    const author = e.target.postAuthor.value;
    const content = e.target.postContent.value;
    if(title && author && content){
      const newPost = {
        id: posts.length + 1,
        title,
        author,
        content,
        reactions: [0,0,0,0,0],
      };
      setPosts([...posts, newPost]);
      e.target.reset();
      navigate("/");
    }
  };

  const incrementReaction = (postId, index) => {
    setPosts(posts.map(p => {
      if(p.id === postId && index < 4){
        const newReactions = [...p.reactions];
        newReactions[index]++;
        return {...p, reactions: newReactions};
      }
      return p;
    }));
  };

  const updatePost = (id, title, content) => {
    setPosts(posts.map(p => p.id === id ? {...p, title, content} : p));
    navigate("/");
  };

  const refreshNotifications = () => {
    setNotifications(["Notification 1", "Notification 2"]);
  };

  return (
    <div>
      <h1>GenZ</h1>
      <nav>
        <a href="/">Posts</a>
        <a href="/users">Users</a>
        <a href="/notifications">Notifications</a>
      </nav>

      <Routes>
        <Route path="/" element={
          <div>
            <form onSubmit={addPost}>
              <input id="postTitle" placeholder="Title" />
              <select id="postAuthor">
                {users.map(u => <option key={u}>{u}</option>)}
              </select>
              <textarea id="postContent" placeholder="Content"></textarea>
              <button type="submit">Add Post</button>
            </form>
            <div className="posts-list">
              {posts.map((post, i) => (
                <div key={post.id} className="post">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <p>Author: {post.author}</p>
                  <div>
                    {post.reactions.map((r, idx) => (
                      <button key={idx} onClick={() => incrementReaction(post.id, idx)}>{r}</button>
                    ))}
                  </div>
                  <button className="button" onClick={() => navigate(`/posts/${post.id}`)}>Edit</button>
                </div>
              ))}
            </div>
          </div>
        }/>

        <Route path="/posts/:id" element={<EditPost posts={posts} updatePost={updatePost} />} />

        <Route path="/users" element={
          <ul>
            {users.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        }/>

        <Route path="/notifications" element={
          <div>
            <button className="button" onClick={refreshNotifications}>Refresh Notifications</button>
            <section className="notificationsList">
              {notifications.map((n,i) => <div key={i}>{n}</div>)}
            </section>
          </div>
        }/>
      </Routes>
    </div>
  );
}

function EditPost({ posts, updatePost }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === parseInt(id));
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleSave = () => {
    updatePost(post.id, title, content);
  };

  return (
    <div className="post">
      <input id="postTitle" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea id="postContent" value={content} onChange={e => setContent(e.target.value)} />
      <button className="button" onClick={handleSave}>Save</button>
    </div>
  );
}
