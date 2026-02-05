import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function PortalLayout() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <Outlet />
      </main>
    </div>
  );
}
