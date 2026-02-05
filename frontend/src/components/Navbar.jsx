import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
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

  const linkStyle = (path) =>
    `px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-600">
        StudentRisk Dashboard
      </h1>

      <div className="flex gap-3">
        <Link to="/" className={linkStyle("/")}>
          Students
        </Link>

        <Link to="/analytics" className={linkStyle("/analytics")}>
          Analytics
        </Link>

        <Link to="/alerts" className={linkStyle("/alerts")}> 
          <span className="flex items-center gap-2">
            Alerts
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </span>
        </Link>
      </div>
    </nav>
  );
}
