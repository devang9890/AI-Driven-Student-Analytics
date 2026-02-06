import { Link } from "react-router-dom";

const normalizeConfidence = (value) => {
  if (value === null || value === undefined) return 0;
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0;
  return numeric <= 1 ? numeric * 100 : numeric;
};

const getBadges = (student) => {
  const badges = [];
  const attendance = Number(student.attendance ?? 0);
  const behaviour = Number(student.behaviour ?? 0);
  const avgMarks = Number(
    student.average_marks ?? student.avg_marks ?? student.marks ?? 0
  );
  const confidence = normalizeConfidence(
    student.confidence_score ?? student.risk_probability ?? student.probability
  );

  if (attendance < 50) {
    badges.push({
      label: "Attendance Issue",
      color: "bg-orange-100 text-orange-700",
      tooltip: "Attendance below recommended threshold",
    });
  }

  if (avgMarks < 50) {
    badges.push({
      label: "Performance Drop",
      color: "bg-red-100 text-red-700",
      tooltip: "Marks trending below safe level",
    });
  }

  if (behaviour < 40) {
    badges.push({
      label: "Behaviour Alert",
      color: "bg-purple-100 text-purple-700",
    });
  }

  if (confidence < 40) {
    badges.push({
      label: "Low Data Confidence",
      color: "bg-gray-200 text-gray-700",
    });
  }

  if (
    confidence >= 75 &&
    attendance >= 70 &&
    avgMarks >= 65 &&
    behaviour >= 50
  ) {
    badges.push({
      label: "Stable",
      color: "bg-green-100 text-green-700",
    });
  }

  if (confidence >= 50 && confidence < 75) {
    badges.push({
      label: "Needs Monitoring",
      color: "bg-yellow-100 text-yellow-700",
    });
  }

  return badges;
};

const StudentCard = ({ student }) => {
  const subjectCount = student.subjects?.length || 0;
  const avgMarks = Number(
    student.average_marks ?? student.avg_marks ?? student.marks ?? 0
  );
  const confidence = normalizeConfidence(
    student.confidence_score ?? student.risk_probability ?? student.probability
  );

  return (
    <Link
      key={student._id}
      to={`/portal/students/${student._id}`}
      className="glass-card rounded-2xl p-6 hover:shadow-2xl transition"
    >
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <h2 className="text-lg font-semibold text-gray-900">{student.name}</h2>
            <div className="flex gap-2 flex-wrap">
              {getBadges(student).map((badge, idx) => (
                <span
                  key={`${badge.label}-${idx}`}
                  title={badge.tooltip}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {subjectCount} {subjectCount === 1 ? "Subject" : "Subjects"}
          </p>
        </div>
        {confidence > 0 && (
          <div className="bg-indigo-100 px-3 py-1 rounded-lg">
            <p className="text-xs text-indigo-700">AI Score</p>
            <p className="text-sm font-bold text-indigo-900">
              {confidence.toFixed(0)}%
            </p>
          </div>
        )}
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
};

export default StudentCard;
