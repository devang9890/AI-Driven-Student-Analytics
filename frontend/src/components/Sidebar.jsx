import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-lg mb-1 ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white shadow h-screen fixed left-0 top-0 p-4">
      <h1 className="text-xl font-bold text-blue-600 mb-6">
        StudentRisk
      </h1>

      <nav>
        <Link to="/" className={linkClass("/")}>
          Students
        </Link>

        <Link to="/analytics" className={linkClass("/analytics")}>
          Analytics
        </Link>
      </nav>
    </aside>
  );
}
