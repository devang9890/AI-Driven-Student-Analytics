import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Sidebar() {
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

  const linkClass = (path) =>
    `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      location.pathname === path
        ? "bg-white/15 text-white shadow"
        : "text-blue-100/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 p-6 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 border-r border-white/10">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,3L1,9L12,15L21,9V10C21,10.55 21.45,11 22,11C22.55,11 23,10.55 23,10V9L12,3M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-white leading-tight">RiskSense</p>
            <p className="text-xs text-blue-100/70">Education Analytics</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        <Link to="/portal/students" className={linkClass("/portal/students")}>
          <span>Students</span>
        </Link>

        <Link to="/portal/analytics" className={linkClass("/portal/analytics")}>
          <span>Analytics</span>
        </Link>

        <Link to="/portal/alerts" className={linkClass("/portal/alerts")}>
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </nav>
    </aside>
  );
}
