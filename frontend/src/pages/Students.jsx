import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/all-students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => {
          const subjectCount = student.subjects?.length || 0;
          const avgMarks = student.average_marks || student.marks || 0;

          return (
            <Link
              key={student._id}
              to={`/portal/students/${student._id}`}
              className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {subjectCount} {subjectCount === 1 ? "Subject" : "Subjects"}
                  </p>
                </div>
                <RiskBadge risk={student.risk_level} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500 text-xs">Attendance</p>
                  <p className="font-semibold">{student.attendance}%</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-gray-500 text-xs">Avg Marks</p>
                  <p className="font-semibold">{avgMarks.toFixed(1)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Students;
