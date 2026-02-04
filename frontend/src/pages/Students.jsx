import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students</h1>

      <ul className="space-y-2">
        {students.map(student => (
          <li
            key={student.id}
            className="p-4 bg-gray-100 rounded"
          >
            {student.name} — {student.department}
          </li>
        ))}
      </ul>
    </div>
  );
}
