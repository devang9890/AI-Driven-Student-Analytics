import { useEffect, useState } from "react";
import api from "../api/axios";
import RiskBadge from "../components/RiskBadge";
import LineChartCard from "../components/LineChartCard";

// -----------------------------
// Dummy trend data (for now)
// -----------------------------
const attendanceData = [
  { label: "Week 1", value: 60 },
  { label: "Week 2", value: 55 },
  { label: "Week 3", value: 50 },
  { label: "Week 4", value: 45 },
];

const marksData = [
  { label: "Test 1", value: 35 },
  { label: "Test 2", value: 30 },
  { label: "Mid", value: 28 },
];

const lmsData = [
  { label: "Week 1", value: 12 },
  { label: "Week 2", value: 14 },
  { label: "Week 3", value: 10 },
  { label: "Week 4", value: 8 },
];


// -----------------------------
// Component
// -----------------------------
export default function StudentDetail({ studentId }) {
  const [summary, setSummary] = useState(null);
  const [predictedRisk, setPredictedRisk] = useState(null);
  const [decline, setDecline] = useState(null);

  // Fetch summary + ML prediction
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [summaryRes, predictedRes] = await Promise.all([
          api.get(`/analytics/summary/${studentId}`),
          api.get(`/prediction/risk/${studentId}`)
        ]);

        if (!mounted) return;

        setSummary(summaryRes.data);
        setPredictedRisk(predictedRes.data?.predicted_risk ?? null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [studentId]);

  // Fetch performance decline
  useEffect(() => {
    api.get(`/analytics/decline/${studentId}`)
      .then(res => setDecline(res.data))
      .catch(err => console.error(err));
  }, [studentId]);

  if (!summary) return <p className="p-6">Loading...</p>;

  return (
    <div>
      {/* Summary Card */}
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Student Performance Summary
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            Attendance: <strong>{summary.attendance_percentage}%</strong>
          </p>
          <p>
            Average Marks: <strong>{summary.average_marks}</strong>
          </p>
          <p>
            LMS Score: <strong>{summary.lms_score}</strong>
          </p>
          <p>
            Risk Level: <RiskBadge risk={summary.risk_hint} />
          </p>

          {predictedRisk && (
            <p className="mt-3">
              AI Predicted Risk: <RiskBadge risk={predictedRisk} />
            </p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <LineChartCard
          title="Attendance Trend"
          data={attendanceData}
          dataKey="value"
        />

        <LineChartCard
          title="Marks Trend"
          data={marksData}
          dataKey="value"
        />

        <LineChartCard
          title="LMS Activity Trend"
          data={lmsData}
          dataKey="value"
        />
      </div>

      {/* Decline Warning */}
      {decline?.overall_decline && (
        <div className="max-w-2xl mx-auto mt-8 p-4 rounded-xl bg-red-50 border border-red-200">
          <h3 className="font-semibold text-red-700">
            ⚠ Performance Decline Detected
          </h3>

          <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
            {decline.attendance_decline && (
              <li>Attendance is declining over recent weeks</li>
            )}
            {decline.marks_decline && (
              <li>Marks show a downward trend</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
