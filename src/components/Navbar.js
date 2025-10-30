import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Posts</Link> |<Link to="/users">Users</Link> |
      <Link to="/notifications">Notifications</Link>
    </nav>
  );
}
