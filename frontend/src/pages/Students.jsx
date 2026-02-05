import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RiskBadge from "../components/RiskBadge";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/all-students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => (
          <Link
            key={student._id}
            to={`/student/${student._id}`}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center justify-between hover:shadow-lg transition"
          >
            <div>
              <p className="text-lg font-semibold text-gray-900">{student.name}</p>
              <p className="text-sm text-gray-500">Attendance: {student.attendance}%</p>
            </div>
            <RiskBadge risk={student.risk_level} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Students;
