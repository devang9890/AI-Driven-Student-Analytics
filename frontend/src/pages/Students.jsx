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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600">Comprehensive risk and performance profiles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((student) => {
          const subjectCount = student.subjects?.length || 0;
          const avgMarks = student.average_marks || student.marks || 0;

          return (
            <Link
              key={student._id}
              to={`/portal/students/${student._id}`}
              className="glass-card rounded-2xl p-6 hover:shadow-2xl transition"
            >
              <div className="flex items-start justify-between mb-4">
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

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-500 text-xs">Attendance</p>
                  <p className="font-semibold text-gray-900">{student.attendance}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-500 text-xs">Avg Marks</p>
                  <p className="font-semibold text-gray-900">{avgMarks.toFixed(1)}</p>
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
