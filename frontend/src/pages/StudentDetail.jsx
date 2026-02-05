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
  RadialBarChart,
  RadialBar,
} from "recharts";
import RiskBadge from "../components/RiskBadge";

export default function StudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [newSubject, setNewSubject] = useState({ subject_name: "", marks: "" });
  const [notes, setNotes] = useState([]);
  const [noteAuthor, setNoteAuthor] = useState("Admin");
  const [noteContent, setNoteContent] = useState("");

  const fetchStudent = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/admin/student/${id}`);
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/students/${id}/notes`);
      setNotes(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchNotes();
  }, [id]);

  const probability = Number(student?.probability ?? 0);
  const subjects = student?.subjects || [];
  const avgMarks = student?.average_marks || 0;

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
      await axios.post(`http://localhost:8000/admin/add-subject/${id}`, {
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
      await axios.put(
        `http://localhost:8000/admin/update-subject/${id}/${subjectName}?marks=${newMarks}`
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
      await axios.delete(
        `http://localhost:8000/admin/delete-subject/${id}/${subjectName}`
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
      await axios.post(`http://localhost:8000/students/${id}/notes`, {
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
      await axios.delete(`http://localhost:8000/notes/${noteId}`);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete note");
    }
  };

  if (!student) return <p className="p-6">Loading student data...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-500">University Academic Analytics</p>
          </div>
          <RiskBadge risk={student.risk_level} />
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600">
            Predicted Risk: <RiskBadge risk={student.risk_level} />
          </p>
          <p className="text-sm text-gray-600">
            Confidence Score: <span className="font-semibold">{probability.toFixed(1)}%</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Attendance</p>
            <p className="text-xl font-semibold">{student.attendance}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Average Marks</p>
            <p className="text-xl font-semibold">{avgMarks.toFixed(1)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500">Behaviour</p>
            <p className="text-xl font-semibold">{student.behaviour}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subject-wise Bar Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
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
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="font-semibold mb-4">Confidence Score</h3>
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
              <p className="text-xs text-gray-500">Confidence Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Subject Alert */}
      {weakSubjects.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-8">
          <h3 className="font-semibold text-red-700 mb-2">⚠ Weak Subjects Detected</h3>
          <div className="flex gap-2 flex-wrap">
            {weakSubjects.map((s) => (
              <span
                key={s.subject_name}
                className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
              >
                {s.subject_name}: {s.marks}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subject Manager */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold mb-4">Manage Subjects</h3>

        {/* Add New Subject */}
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <h4 className="font-semibold text-sm mb-3">Add New Subject</h4>
          <div className="flex gap-2">
            <input
              placeholder="Subject Name"
              value={newSubject.subject_name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, subject_name: e.target.value })
              }
              className="flex-1 p-2 border rounded"
            />
            <input
              placeholder="Marks"
              type="number"
              value={newSubject.marks}
              onChange={(e) =>
                setNewSubject({ ...newSubject, marks: e.target.value })
              }
              className="w-24 p-2 border rounded"
            />
            <button
              onClick={handleAddSubject}
              className="bg-green-600 text-white px-4 py-2 rounded"
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
              className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
            >
              <div className="flex-1">
                <p className="font-semibold">{subject.subject_name}</p>
              </div>

              {editingSubject === subject.subject_name ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    defaultValue={subject.marks}
                    className="w-20 p-1 border rounded"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateSubject(subject.subject_name, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingSubject(null)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 items-center">
                  <p className="font-bold text-lg">{subject.marks}</p>
                  <button
                    onClick={() => setEditingSubject(subject.subject_name)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject.subject_name)}
                    className="text-red-600 text-sm"
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
      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
        <h3 className="font-semibold mb-4">Faculty Notes</h3>

        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <input
              value={noteAuthor}
              onChange={(e) => setNoteAuthor(e.target.value)}
              placeholder="Author"
              className="p-2 border rounded md:col-span-1"
            />
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write a note..."
              className="p-2 border rounded md:col-span-3"
              rows={2}
            />
          </div>
          <button
            onClick={handleAddNote}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Note
          </button>
        </div>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note._id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{note.author}</p>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="text-red-500 text-sm"
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
