import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const severityStyles = {
  HIGH: "bg-red-50 text-red-700 border-red-200",
  MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200",
  LOW: "bg-blue-50 text-blue-700 border-blue-200",
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const unreadCount = useMemo(
    () => alerts.filter((a) => !a.is_read).length,
    [alerts]
  );

  const markRead = async (id) => {
    try {
      await api.patch(`/alerts/${id}/read`);
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, is_read: true } : a))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600">Prioritize critical student interventions</p>
        </div>
        <div className="text-sm text-gray-600">
          Unread: <span className="font-semibold text-gray-900">{unreadCount}</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="glass-card p-6 rounded-2xl text-gray-600">
          No alerts found.
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`glass-card p-5 rounded-2xl flex items-center justify-between ${
                alert.is_read ? "opacity-70" : ""
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                      severityStyles[alert.severity] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {alert.severity || "LOW"}
                  </span>
                  <p className="text-sm text-gray-500">
                    {timeAgo(alert.created_at)}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">{alert.student_name}</p>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>

              {!alert.is_read && (
                <button
                  onClick={() => markRead(alert._id)}
                  className="text-blue-700 text-sm font-semibold"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
