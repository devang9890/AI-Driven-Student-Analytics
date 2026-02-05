import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function PortalLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <Sidebar />
      <main className="ml-64 w-full min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.10),transparent_45%),radial-gradient(circle_at_60%_80%,rgba(14,165,233,0.12),transparent_40%)]" />
        <div className="relative p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
