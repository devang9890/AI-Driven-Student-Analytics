import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";


export default function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Students</h2>

      <ul className="space-y-2">
  {students.map(s => (
    <Link
      key={s.id}
      to={`/students/${s.id}`}
      className="block p-3 bg-white rounded shadow hover:bg-gray-100"
    >
      {s.name} — {s.department}
    </Link>
  ))}
</ul>

    </div>
  );
}
