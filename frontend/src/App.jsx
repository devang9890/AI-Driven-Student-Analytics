import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Dashboard from "./admin/pages/Dashboard";
import ManualEntry from "./admin/pages/ManualEntry";
import ExcelUpload from "./admin/pages/ExcelUpload";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";

function Analytics() {
  return <h2 className="text-xl font-bold">Analytics Coming Soon</h2>;
}

export default function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <Dashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/manual-entry"
            element={
              <AdminProtectedRoute>
                <ManualEntry />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/excel-upload"
            element={
              <AdminProtectedRoute>
                <ExcelUpload />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}
