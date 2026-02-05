import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      location.pathname === path
        ? "bg-white/15 text-white shadow"
        : "text-blue-100/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 text-white p-6 fixed left-0 top-0 border-r border-white/10">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,3L1,9L12,15L21,9V10C21,10.55 21.45,11 22,11C22.55,11 23,10.55 23,10V9L12,3M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">RiskSense</p>
            <p className="text-xs text-blue-100/70">Education Analytics</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <Link to="/admin" className={linkClass("/admin")}>
          Dashboard
        </Link>

        <Link to="/admin/manual-entry" className={linkClass("/admin/manual-entry")}>
          Manual Entry
        </Link>

        <Link to="/admin/excel" className={linkClass("/admin/excel")}>
          Excel Upload
        </Link>

        <Link to="/admin/students" className={linkClass("/admin/students")}>
          Students
        </Link>

        <Link to="/admin/alerts" className={linkClass("/admin/alerts")}>
          Alerts
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
