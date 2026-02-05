import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="ml-64 p-6 w-full">
        {children}
      </main>
    </div>
  );
}
