import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8000/admin/stats").then((res) => setStats(res.data));
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
    </AdminLayout>
  );
};

export default Dashboard;
