import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Dashboard from "./admin/pages/Dashboard";
import ManualEntry from "./admin/pages/ManualEntry";
import ExcelUpload from "./admin/pages/ExcelUpload";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminStudents from "./admin/pages/Students";

export default function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Students />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />

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
            path="/admin/students"
            element={
              <AdminProtectedRoute>
                <AdminStudents />
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
