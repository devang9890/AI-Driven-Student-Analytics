import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import RiskBadge from "../components/RiskBadge";
import LineChartCard from "../components/LineChartCard";


// -----------------------------
// Component
// -----------------------------
export default function StudentDetail() {
  const { id } = useParams();

  const [summary, setSummary] = useState(null);
  const [predictedRisk, setPredictedRisk] = useState(null);
  const [decline, setDecline] = useState(null);
  const [alert, setAlert] = useState(null);

  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [lmsData, setLmsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Core analytics
        const summaryRes = await api.get(`/analytics/summary/${id}`);
        const predictionRes = await api.get(`/prediction/risk/${id}`);
        const declineRes = await api.get(`/analytics/decline/${id}`);
        const alertRes = await api.get(`/alerts/check/${id}`);

        // Trend data
        const attendanceTrend = await api.get(`/analytics/attendance-trend/${id}`);
        const marksTrend = await api.get(`/analytics/marks-trend/${id}`);
        const lmsTrend = await api.get(`/analytics/lms-trend/${id}`);

        setSummary(summaryRes.data);
        setPredictedRisk(predictionRes.data.predicted_risk);
        setDecline(declineRes.data);
        setAlert(alertRes.data);

        setAttendanceData(attendanceTrend.data);
        setMarksData(marksTrend.data);
        setLmsData(lmsTrend.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!summary)
    return <p className="p-6">Loading student data...</p>;

  return (
    <div className="max-w-6xl mx-auto">

      {/* ---------------- Summary Card ---------------- */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">
          Student Analytics
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
            <p className="mt-2">
              AI Predicted Risk: <RiskBadge risk={predictedRisk} />
            </p>
          )}
        </div>
      </div>


      {/* ---------------- Charts Section ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          title="LMS Activity"
          data={lmsData}
          dataKey="value"
        />
      </div>


      {/* ---------------- Decline Alert ---------------- */}
      {decline?.overall_decline && (
        <div className="mt-8 p-4 rounded-xl bg-red-50 border border-red-200">
          <h3 className="font-semibold text-red-700">
            ⚠ Performance Decline Detected
          </h3>

          <ul className="text-sm text-red-600 mt-2 list-disc list-inside">
            {decline.attendance_decline && (
              <li>Attendance is dropping over recent weeks</li>
            )}
            {decline.marks_decline && (
              <li>Marks are showing a downward trend</li>
            )}
          </ul>
        </div>
      )}


      {/* ---------------- Early Alert System ---------------- */}
      {alert?.alert && (
        <div className="mt-6 p-4 rounded-xl bg-red-100 border border-red-300">
          <h3 className="font-bold text-red-700">
            🚨 Early Warning Alert
          </h3>

          <p className="text-red-600 mt-1">
            {alert.message}
          </p>
        </div>
      )}

    </div>
  );
}
