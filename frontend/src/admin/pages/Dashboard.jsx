import AdminLayout from "../layout/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          Total Students
          <h3 className="text-2xl font-bold mt-2">0</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          High Risk Students
          <h3 className="text-2xl font-bold mt-2">0</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          Alerts Triggered
          <h3 className="text-2xl font-bold mt-2">0</h3>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
