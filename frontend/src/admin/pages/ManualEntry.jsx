import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import api from "../../api/axios";

const ManualEntry = () => {
  const [form, setForm] = useState({
    name: "",
    attendance: "",
    behaviour: "",
    fees_paid: false,
  });

  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState({
    subject_name: "",
    marks: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubjectChange = (e) => {
    const { name, value } = e.target;
    setCurrentSubject({ ...currentSubject, [name]: value });
  };

  const addSubject = () => {
    if (!currentSubject.subject_name || !currentSubject.marks) {
      alert("Please enter both subject name and marks");
      return;
    }

    // Check duplicate
    if (subjects.some((s) => s.subject_name === currentSubject.subject_name)) {
      alert("Subject already added");
      return;
    }

    setSubjects([
      ...subjects,
      {
        subject_name: currentSubject.subject_name,
        marks: parseFloat(currentSubject.marks),
      },
    ]);

    setCurrentSubject({ subject_name: "", marks: "" });
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.attendance || !form.behaviour) {
      alert("Please fill all student details");
      return;
    }

    if (subjects.length === 0) {
      alert("Please add at least one subject");
      return;
    }

    try {
      const payload = {
        name: form.name,
        attendance: parseFloat(form.attendance),
        behaviour: parseFloat(form.behaviour),
        fees_paid: !!form.fees_paid,
        subjects: subjects,
      };

      const res = await api.post("/admin/add-student", payload);

      const riskLabel = res?.data?.risk_level ?? "N/A";
      const probability = res?.data?.probability ?? 0;
      alert(
        `Student added successfully!\nRisk Level: ${riskLabel} (${probability.toFixed(
          1
        )}%)`
      );

      // Reset form
      setForm({
        name: "",
        attendance: "",
        behaviour: "",
        fees_paid: false,
      });
      setSubjects([]);
    } catch (err) {
      alert("Error submitting data");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manual Student Entry</h2>
        <p className="text-gray-600">Add student records and generate risk insights</p>
      </div>

      <div className="glass-card p-6 rounded-2xl max-w-3xl">
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Student Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              placeholder="Student Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
              onChange={handleChange}
            />

            <input
              name="attendance"
              value={form.attendance}
              placeholder="Attendance %"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
              onChange={handleChange}
            />

            <input
              name="behaviour"
              value={form.behaviour}
              placeholder="Behaviour Score"
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
              onChange={handleChange}
            />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="fees_paid"
                checked={form.fees_paid}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              Fees Paid
            </label>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Subjects & Marks</h3>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              name="subject_name"
              value={currentSubject.subject_name}
              placeholder="Subject Name (e.g., Math, DBMS)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
              onChange={handleSubjectChange}
            />

            <input
              name="marks"
              value={currentSubject.marks}
              placeholder="Marks"
              type="number"
              className="w-full md:w-32 p-3 border border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
              onChange={handleSubjectChange}
            />

            <button
              onClick={addSubject}
              className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              + Add
            </button>
          </div>

          {subjects.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="font-semibold text-gray-800 mb-3">Added Subjects</p>
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-3 rounded-lg mb-2 border border-gray-100"
                >
                  <span className="text-sm text-gray-700">
                    {subject.subject_name}: <strong>{subject.marks}</strong>
                  </span>
                  <button
                    onClick={() => removeSubject(index)}
                    className="text-red-600 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-3 rounded-lg w-full font-semibold shadow hover:shadow-lg transition"
        >
          Submit & Predict Risk
        </button>
      </div>
    </AdminLayout>
  );
};

export default ManualEntry;
