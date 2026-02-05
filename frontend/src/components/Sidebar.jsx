import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/alerts");
        const unread = (res.data || []).filter((a) => !a.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlerts();
  }, []);

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg mb-1 ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white shadow h-screen fixed left-0 top-0 p-4">
      <h1 className="text-xl font-bold text-blue-600 mb-6">
        StudentRisk
      </h1>

      <nav>
        <Link to="/" className={linkClass("/")}>
          Students
        </Link>

        <Link to="/analytics" className={linkClass("/analytics")}>
          Analytics
        </Link>

        <Link to="/alerts" className={linkClass("/alerts")}> 
          <div className="flex items-center justify-between">
            <span>Alerts</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </Link>
      </nav>
    </aside>
  );
}
