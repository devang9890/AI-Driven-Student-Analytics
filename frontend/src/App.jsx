import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Students from "./pages/Students";
import StudentDetail from "./pages/StudentDetail";

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
        </Routes>
      </DashboardLayout>
    </Router>
  );
}
