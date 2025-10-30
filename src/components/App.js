import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home";
import Users from "../pages/Users";
import NotificationsPage from "../pages/NotificationsPage";
import PostDetail from "../pages/PostDetail";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </Router>
    </div>
  );
}
