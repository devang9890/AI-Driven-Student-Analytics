import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
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

const Analytics = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await api.get("/admin/all-students");
    setStudents(res.data);
  };

  const riskCounts = useMemo(() => {
    const high = students.filter((s) => s.risk_level === "HIGH RISK").length;
    const medium = students.filter((s) => s.risk_level === "MEDIUM RISK").length;
    const low = students.filter((s) => s.risk_level === "LOW RISK").length;
    return { high, medium, low };
  }, [students]);

  const avgScores = useMemo(() => {
    if (!students.length) return { attendance: 0, marks: 0, behaviour: 0, probability: 0 };
    const totals = students.reduce(
      (acc, s) => {
        acc.attendance += Number(s.attendance || 0);
        acc.marks += Number(s.average_marks || s.marks || 0);
        acc.behaviour += Number(s.behaviour || 0);
        acc.probability += Number(s.risk_probability ?? s.probability ?? 0);
        return acc;
      },
      { attendance: 0, marks: 0, behaviour: 0, probability: 0 }
    );
    const count = students.length;
    return {
      attendance: totals.attendance / count,
      marks: totals.marks / count,
      behaviour: totals.behaviour / count,
      probability: totals.probability / count,
    };
  }, [students]);

  const riskPie = useMemo(
    () => [
      { name: "Needs Attention", value: riskCounts.high },
      { name: "Monitor", value: riskCounts.medium },
      { name: "Stable", value: riskCounts.low },
    ],
    [riskCounts]
  );

  const scoresBar = useMemo(
    () => [
      { name: "Attendance", value: Number(avgScores.attendance.toFixed(1)) },
      { name: "Marks", value: Number(avgScores.marks.toFixed(1)) },
      { name: "Behaviour", value: Number(avgScores.behaviour.toFixed(1)) },
    ],
    [avgScores]
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Population trends and predictive insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl shadow-md border border-blue-100">
          <p className="text-sm text-blue-700">Needs Attention</p>
          <p className="text-3xl font-semibold text-blue-700">{riskCounts.high}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-2xl shadow-md border border-yellow-100">
          <p className="text-sm text-yellow-700">Monitor</p>
          <p className="text-3xl font-semibold text-yellow-700">{riskCounts.medium}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-6 rounded-2xl shadow-md border border-green-100">
          <p className="text-sm text-green-700">Stable</p>
          <p className="text-3xl font-semibold text-green-700">{riskCounts.low}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Average Scores</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoresBar}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" fill="#1d4ed8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Average AI Confidence Score</h3>
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={18}
                data={[{ name: "Probability", value: avgScores.probability }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" fill="#f59e0b" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-bold text-gray-900">{avgScores.probability.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Avg Probability</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Student Attention Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskPie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                  <Cell fill="#ef4444" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
