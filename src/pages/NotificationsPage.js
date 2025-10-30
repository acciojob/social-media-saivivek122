import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotifications } from "../redux/notificationsSlice";

export default function NotificationsPage() {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  return (
    <section className="notificationsList">
      <button className="button" onClick={() => dispatch(setNotifications())}>
        Refresh Notifications
      </button>
      {notifications.map((n, i) => (
        <div key={i}>{n}</div>
      ))}
    </section>
  );
}
