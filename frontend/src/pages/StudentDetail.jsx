import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({ subject_name: "", marks: "" });
  const [notes, setNotes] = useState([]);
  const [noteAuthor, setNoteAuthor] = useState("Admin");
  const [noteContent, setNoteContent] = useState("");
  const [prediction, setPrediction] = useState(null);

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/admin/student/${id}`);
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrediction = async () => {
    try {
      const res = await api.get(`/prediction/risk/${id}`);
      setPrediction(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get(`/students/${id}/notes`);
      setNotes(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchNotes();
    fetchPrediction();
  }, [id]);

  const probability = Number(student?.probability ?? 0);
  const subjects = student?.subjects || [];
  const avgMarks = student?.average_marks || 0;

  const normalizeConfidence = (value) => {
    if (value === null || value === undefined) return 0;
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return 0;
    return numeric <= 1 ? numeric * 100 : numeric;
  };

  const resolveLabel = () => {
    const raw =
      prediction?.predicted_label ||
      student?.predicted_label ||
      student?.risk_level ||
      "";
    return String(raw).toUpperCase();
  };

  const labelToStatus = (label) => {
    if (label.includes("HIGH")) return "Needs Attention";
    if (label.includes("MEDIUM")) return "Monitor";
    if (label.includes("LOW")) return "Stable";
    return "Stable";
  };

  const getBadges = () => {
    const badges = [];
    const attendance = Number(student?.attendance ?? 0);
    const behaviour = Number(student?.behaviour ?? 0);
    const avgMarksValue = Number(avgMarks ?? 0);
    const confidence = normalizeConfidence(
      prediction?.confidence_score ?? student?.confidence_score ?? student?.probability
    );

    if (attendance < 50) {
      badges.push({
        label: "Attendance Issue",
        color: "bg-orange-100 text-orange-700",
        tooltip: "Attendance below recommended threshold",
      });
    }

    if (avgMarksValue < 50) {
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
      avgMarksValue >= 65 &&
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

  // Subject-wise bar chart data
  const subjectData = useMemo(() => {
    return subjects.map((s) => ({
      name: s.subject_name,
      marks: s.marks,
    }));
  }, [subjects]);

  // Detect weak subjects
  const weakSubjects = useMemo(() => {
    return subjects.filter((s) => s.marks < 50);
  }, [subjects]);

  // Add new subject
  const handleAddSubject = async () => {
    if (!newSubject.subject_name || !newSubject.marks) {
      alert("Please enter subject name and marks");
      return;
    }

    try {
      await api.post(`/admin/add-subject/${id}`, {
        subject_name: newSubject.subject_name,
        marks: parseFloat(newSubject.marks),
      });
      setNewSubject({ subject_name: "", marks: "" });
      fetchStudent();
      alert("Subject added successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add subject");
    }
  };

  // Update subject marks
  const handleUpdateSubject = async (subjectName, newMarks) => {
    try {
      await api.put(
        `/admin/update-subject/${id}/${subjectName}?marks=${newMarks}`
      );
      setEditingSubject(null);
      fetchStudent();
      alert("Subject updated successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update subject");
    }
  };

  // Delete subject
  const handleDeleteSubject = async (subjectName) => {
    if (!window.confirm(`Delete ${subjectName}?`)) return;

    try {
      await api.delete(
        `/admin/delete-subject/${id}/${subjectName}`
      );
      fetchStudent();
      alert("Subject deleted successfully");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete subject");
    }
  };

  const handleAddNote = async () => {
    if (!noteAuthor || !noteContent.trim()) {
      alert("Please enter author and note content");
      return;
    }

    try {
      await api.post(`/students/${id}/notes`, {
        author: noteAuthor,
        content: noteContent.trim(),
      });
      setNoteContent("");
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete note");
    }
  };

  if (!student) return <p className="p-6">Loading student data...</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header Card */}
      <div className="glass-card p-6 rounded-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <div className="flex gap-2 flex-wrap">
                {getBadges().map((badge, idx) => (
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
            <p className="text-gray-500">RiskSense Education Analytics</p>
          </div>
        </div>

        {/* AI Confidence Score & Observation Section */}
        {prediction && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI Confidence Score Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl p-6 border border-indigo-200 text-center">
              <p className="text-sm text-indigo-700 mb-1">Academic Status</p>
              <p className="text-xl font-semibold text-indigo-900 mb-3">
                {labelToStatus(resolveLabel())}
              </p>
              <p className="text-sm text-indigo-700 mb-2">AI Confidence Score</p>
              <p className="text-5xl font-bold text-indigo-900">
                {normalizeConfidence(prediction.confidence_score).toFixed(0)}%
              </p>
            </div>

            {/* AI Observation Card */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">AI observation:</h4>
              <ul className="space-y-2">
                {prediction.explanation?.map((reason, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-xl font-semibold">{student.attendance}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Average Marks</p>
            <p className="text-xl font-semibold">{avgMarks.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-sm text-gray-500">Behaviour</p>
            <p className="text-xl font-semibold">{student.behaviour}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subject-wise Bar Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Subject-wise Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="marks" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="font-semibold mb-4">AI Confidence Score</h3>
          <div className="relative h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                barSize={18}
                data={[{ name: "Confidence", value: normalizeConfidence(prediction?.confidence_score ?? probability) }]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" fill="#6366f1" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-2xl font-bold">
                {normalizeConfidence(prediction?.confidence_score ?? probability).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">AI Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Subject Alert */}
      {weakSubjects.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-8">
          <h3 className="font-semibold text-rose-700 mb-2">⚠ Weak Subjects Detected</h3>
          <div className="flex gap-2 flex-wrap">
            {weakSubjects.map((s) => (
              <span
                key={s.subject_name}
                className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm"
              >
                {s.subject_name}: {s.marks}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subject Manager */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Manage Subjects</h3>

        {/* Add New Subject */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <h4 className="font-semibold text-sm mb-3">Add New Subject</h4>
          <div className="flex gap-2">
            <input
              placeholder="Subject Name"
              value={newSubject.subject_name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, subject_name: e.target.value })
              }
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            />
            <input
              placeholder="Marks"
              type="number"
              value={newSubject.marks}
              onChange={(e) =>
                setNewSubject({ ...newSubject, marks: e.target.value })
              }
              className="w-24 p-2 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
            />
            <button
              onClick={handleAddSubject}
              className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Existing Subjects */}
        <div className="space-y-2">
          {subjects.map((subject) => (
            <div
              key={subject.subject_name}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100"
            >
              <div className="flex-1">
                <p className="font-semibold">{subject.subject_name}</p>
              </div>

              {editingSubject === subject.subject_name ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={subject.marks}
                    className="w-20 p-1 border border-gray-300 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateSubject(subject.subject_name, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingSubject(null)}
                    className="text-gray-500 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <p className="font-bold text-lg">{subject.marks}</p>
                  <button
                    onClick={() => setEditingSubject(subject.subject_name)}
                    className="text-blue-700 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.subject_name)}
                    className="text-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Notes */}
      <div className="glass-card rounded-2xl p-6 mt-8">
        <h3 className="font-semibold mb-4">Faculty Notes</h3>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <input
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              placeholder="Author"
              className="p-2 border border-gray-300 rounded-lg md:col-span-1"
            />
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write a note..."
              className="p-2 border border-gray-300 rounded-lg md:col-span-3"
              rows={2}
            />
          </div>
          <button
            onClick={handleAddNote}
            className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
          >
            Add Note
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note._id} className="border-l-4 border-blue-600 pl-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{note.author}</p>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-600 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700 text-sm mt-1">{note.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {note.created_at ? new Date(note.created_at).toLocaleString() : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
