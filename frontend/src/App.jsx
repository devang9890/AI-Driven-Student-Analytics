import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import PortalLayout from "./layouts/PortalLayout";
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
import AdminAlerts from "./admin/pages/Alerts";
import WelcomePage from "./pages/WelcomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<AdminLogin />} />

        {/* Admin routes */}
        <Route
          path="/admin"
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
          path="/admin/excel"
          element={
            <AdminProtectedRoute>
              <ExcelUpload />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/alerts"
          element={
            <AdminProtectedRoute>
              <AdminAlerts />
            </AdminProtectedRoute>
          }
        />

        {/* Analytics Portal routes */}
        <Route
          path="/portal"
          element={
            <AdminProtectedRoute>
              <PortalLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/portal/students" replace />} />
          <Route path="students" element={<Students />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </Router>
  );
}
