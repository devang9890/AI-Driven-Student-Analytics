import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../layout/AdminLayout";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchStudents = async (risk = "") => {
    let url = "/admin/students";

    if (risk) {
      url += `?risk=${risk}`;
      setFilter(risk);
    } else {
      setFilter("");
    }

    const res = await api.get(url);
    setStudents(res.data);
  };

  const deleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?\n\nThis will permanently remove the student from:\n- Students database\n- All alerts\n- All notes`)) return;

    try {
      const response = await api.delete(`/admin/delete-student/${id}`);
      alert(response.data.message || "Student deleted successfully");
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.detail || "Delete failed");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Students</h2>
        <p className="text-gray-600">Manage profiles and risk categories</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => fetchStudents()}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "" ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
          }`}
        >
          All
        </button>

        <button
          onClick={() => fetchStudents("HIGH RISK")}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "HIGH RISK" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
          }`}
        >
          Needs Attention
        </button>

        <button
          onClick={() => fetchStudents("MEDIUM RISK")}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "MEDIUM RISK" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-700 border-gray-200 hover:border-yellow-400"
          }`}
        >
          Monitor
        </button>

        <button
          onClick={() => fetchStudents("LOW RISK")}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
            filter === "LOW RISK" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-700 border-gray-200 hover:border-green-400"
          }`}
        >
          Stable
        </button>
      </div>

      {/* Student Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Subjects</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Avg Marks</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Attendance</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Behaviour</th>
              <th className="p-4 text-sm font-semibold text-gray-600">AI Score</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => {
              const subjectCount = student.subjects?.length || 0;
              const avgMarks = student.average_marks || student.marks || 0;

              return (
                <tr key={student._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{student.name}</td>
                  <td className="p-4 text-center text-gray-700">{subjectCount}</td>
                  <td className="p-4 text-center text-gray-700">{avgMarks.toFixed(1)}</td>
                  <td className="p-4 text-center text-gray-700">{student.attendance}</td>
                  <td className="p-4 text-center text-gray-700">{student.behaviour}</td>
                  <td className="p-4 text-center font-semibold text-gray-900">
                    {student.risk_probability
                      ? `${student.risk_probability.toFixed(0)}%`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteStudent(student._id, student.name)}
                      className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1.5 rounded-lg text-sm shadow hover:shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Students;
