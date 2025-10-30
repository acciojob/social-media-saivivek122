import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Users() {
  const users = useSelector((state) => state.users);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u}>
            <Link to={`/users/${u}`}>{u}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
