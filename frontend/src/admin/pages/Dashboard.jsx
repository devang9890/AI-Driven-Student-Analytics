import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/admin/stats").then((res) => setStats(res.data));
    axios.get("http://localhost:8000/admin/alerts").then((res) => setAlerts(res.data));
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-4 gap-6">
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
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">High Risk Alerts</h2>

        {alerts.length === 0 ? (
          <p>No active alerts</p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert._id} className="bg-red-100 p-4 rounded-lg shadow">
                ⚠️ {alert.student_name} is HIGH RISK
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
