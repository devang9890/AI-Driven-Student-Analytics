import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/alerts").then((res) => setAlerts(res.data));
  }, []);

  const highRiskToday = useMemo(() => {
    const today = new Date().toDateString();
    return alerts.filter((a) => {
      if (!a.created_at) return false;
      const created = new Date(a.created_at).toDateString();
      return a.severity === "HIGH" && created === today;
    }).length;
  }, [alerts]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Real-time risk intelligence and university insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-gray-500">Total Students</p>
          <h3 className="text-3xl font-bold mt-2 text-gray-900">{stats.total_students}</h3>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-md p-6 border border-blue-100">
          <p className="text-sm text-blue-700">Needs Attention</p>
          <h3 className="text-3xl font-bold mt-2 text-blue-700">{stats.high_risk}</h3>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl shadow-md p-6 border border-yellow-100">
          <p className="text-sm text-yellow-700">Monitor</p>
          <h3 className="text-3xl font-bold mt-2 text-yellow-700">{stats.medium_risk}</h3>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-md p-6 border border-green-100">
          <p className="text-sm text-green-700">Stable</p>
          <h3 className="text-3xl font-bold mt-2 text-green-700">{stats.low_risk}</h3>
        </div>

        <Link
          to="/admin/alerts"
          className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl shadow-md p-6 border border-indigo-200 hover:shadow-lg transition"
        >
          <div className="text-sm text-blue-700">Priority Alerts Today</div>
          <h3 className="text-3xl font-bold mt-2 text-blue-700">{highRiskToday}</h3>
        </Link>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Latest Alerts</h2>
          <Link to="/admin/alerts" className="text-sm text-blue-700 font-semibold">
            View all
          </Link>
        </div>

        {alerts.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-gray-600">
            No active alerts
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert._id}
                className="glass-card rounded-2xl p-4 flex items-start gap-3"
              >
                <span className="text-red-600">⚠️</span>
                <div>
                  <p className="font-semibold text-gray-900">{alert.student_name}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/portal"
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition"
      >
        Show Analytics →
      </Link>
    </AdminLayout>
  );
};

export default Dashboard;
