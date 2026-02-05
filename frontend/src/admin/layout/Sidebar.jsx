import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <Link to="/admin" className="hover:text-blue-400">
          Dashboard
        </Link>

        <Link to="/admin/manual-entry" className="hover:text-blue-400">
          Manual Entry
        </Link>

        <Link to="/admin/excel" className="hover:text-blue-400">
          Excel Upload
        </Link>

        <Link to="/admin/students" className="hover:text-blue-400">
          Students
        </Link>

        <Link to="/admin/alerts" className="hover:text-blue-400">
          Alerts
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
