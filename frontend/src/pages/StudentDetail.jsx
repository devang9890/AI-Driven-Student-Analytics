import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import RiskBadge from "../components/RiskBadge";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/admin/student/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudent();
  }, [id]);

  const probability = Number(student?.probability ?? student?.risk_probability ?? 0);

  const scoreData = useMemo(
    () => [
      { name: "Attendance", value: Number(student?.attendance ?? 0) },
      { name: "Marks", value: Number(student?.marks ?? 0) },
      { name: "Behaviour", value: Number(student?.behaviour ?? 0) },
    ],
    [student]
  );

  const riskPie = useMemo(
    () => [
      { name: "Risk", value: probability },
      { name: "Remaining", value: Math.max(0, 100 - probability) },
    ],
    [probability]
  );

  if (!student) return <p className="p-6">Loading student data...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-500">AI Student Risk Analytics</p>
          </div>
          <RiskBadge risk={student.risk_level} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Probability</p>
            <p className="text-xl font-semibold">{probability.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-xl font-semibold">{student.attendance}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Marks</p>
            <p className="text-xl font-semibold">{student.marks}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Behaviour</p>
            <p className="text-xl font-semibold">{student.behaviour}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Scores Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Risk Probability</h3>
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={18}
                data={[{ name: "Probability", value: probability }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" fill="#f59e0b" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-bold">{probability.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Risk Probability</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Risk Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPie}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
