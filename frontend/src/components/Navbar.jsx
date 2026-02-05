import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const linkStyle = (path) =>
    `px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold text-blue-600">
        StudentRisk Dashboard
      </h1>

      <div className="flex gap-3">
        <Link to="/" className={linkStyle("/")}>
          Students
        </Link>

        <Link to="/analytics" className={linkStyle("/analytics")}>
          Analytics
        </Link>
      </div>
    </nav>
  );
}
