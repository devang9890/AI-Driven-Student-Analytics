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
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          Total Students
          <h3 className="text-2xl font-bold mt-2">{stats.total_students}</h3>
        </div>

        <div className="bg-red-100 p-6 rounded-xl shadow">
          High Risk
          <h3 className="text-2xl font-bold mt-2">{stats.high_risk}</h3>
        </div>

        <div className="bg-yellow-100 p-6 rounded-xl shadow">
          Medium Risk
          <h3 className="text-2xl font-bold mt-2">{stats.medium_risk}</h3>
        </div>

        <div className="bg-green-100 p-6 rounded-xl shadow">
          Low Risk
          <h3 className="text-2xl font-bold mt-2">{stats.low_risk}</h3>
        </div>

        <Link to="/admin/alerts" className="bg-red-50 p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="text-sm text-red-600">🔥 High Risk Alerts Today</div>
          <h3 className="text-2xl font-bold mt-2">{highRiskToday}</h3>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Latest Alerts</h2>

        {alerts.length === 0 ? (
          <p>No active alerts</p>
        ) : (
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert._id} className="bg-red-100 p-4 rounded-lg shadow">
                ⚠️ {alert.student_name}: {alert.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/portal"
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg hover:bg-blue-700"
      >
        Show Analytics →
      </Link>
    </AdminLayout>
  );
};

export default Dashboard;
