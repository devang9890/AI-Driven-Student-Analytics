import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../layout/AdminLayout";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchStudents = async (risk = "") => {
    let url = "http://localhost:8000/admin/students";

    if (risk) {
      url += `?risk=${risk}`;
      setFilter(risk);
    } else {
      setFilter("");
    }

    const res = await axios.get(url);
    setStudents(res.data);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`http://localhost:8000/admin/delete-student/${id}`);
      fetchStudents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Students</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => fetchStudents()} className="bg-gray-200 px-4 py-2 rounded">
          All
        </button>

        <button onClick={() => fetchStudents("HIGH RISK")} className="bg-red-500 text-white px-4 py-2 rounded">
          High Risk
        </button>

        <button onClick={() => fetchStudents("MEDIUM RISK")} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Medium Risk
        </button>

        <button onClick={() => fetchStudents("LOW RISK")} className="bg-green-500 text-white px-4 py-2 rounded">
          Low Risk
        </button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Attendance</th>
              <th className="p-3">Marks</th>
              <th className="p-3">Behaviour</th>
              <th className="p-3">Risk</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="p-3">{student.name}</td>
                <td className="p-3 text-center">{student.attendance}</td>
                <td className="p-3 text-center">{student.marks}</td>
                <td className="p-3 text-center">{student.behaviour}</td>
                <td className="p-3 text-center font-bold">
                  {student.risk_level} {student.risk_probability ? `(${student.risk_probability.toFixed(1)}%)` : ""}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteStudent(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Students;
