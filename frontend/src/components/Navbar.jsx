import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Navbar() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await api.get("/alerts");
        const unread = (res.data || []).filter((a) => !a.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAlerts();
  }, []);

  const linkStyle = (path) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      location.pathname === path
        ? "bg-blue-700 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="glass-panel border-b border-white/40 px-6 py-3 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-bold text-gray-900">RiskSense</h1>
        <p className="text-xs text-gray-500">Education Analytics Portal</p>
      </div>

      <div className="flex gap-2">
        <Link to="/portal/students" className={linkStyle("/portal/students")}>
          Students
        </Link>

        <Link to="/portal/analytics" className={linkStyle("/portal/analytics")}>
          Analytics
        </Link>

        <Link to="/portal/alerts" className={linkStyle("/portal/alerts")}>
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
