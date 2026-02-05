import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";

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

      const res = await axios.post(
        "http://localhost:8000/admin/add-student",
        payload
      );

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
      <h2 className="text-2xl font-bold mb-6">Manual Student Entry</h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Student Details</h3>

          <input
            name="name"
            value={form.name}
            placeholder="Student Name"
            className="w-full p-3 border rounded mb-3"
            onChange={handleChange}
          />

          <input
            name="attendance"
            value={form.attendance}
            placeholder="Attendance %"
            type="number"
            className="w-full p-3 border rounded mb-3"
            onChange={handleChange}
          />

          <input
            name="behaviour"
            value={form.behaviour}
            placeholder="Behaviour Score"
            type="number"
            className="w-full p-3 border rounded mb-3"
            onChange={handleChange}
          />

          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              name="fees_paid"
              checked={form.fees_paid}
              onChange={handleChange}
            />
            Fees Paid
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Subjects & Marks</h3>

          <div className="flex gap-2 mb-3">
            <input
              name="subject_name"
              value={currentSubject.subject_name}
              placeholder="Subject Name (e.g., Math, DBMS)"
              className="flex-1 p-3 border rounded"
              onChange={handleSubjectChange}
            />

            <input
              name="marks"
              value={currentSubject.marks}
              placeholder="Marks"
              type="number"
              className="w-32 p-3 border rounded"
              onChange={handleSubjectChange}
            />

            <button
              onClick={addSubject}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add
            </button>
          </div>

          {subjects.length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">Added Subjects:</p>
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-2 rounded mb-2"
                >
                  <span>
                    {subject.subject_name}: <strong>{subject.marks}</strong>
                  </span>
                  <button
                    onClick={() => removeSubject(index)}
                    className="text-red-500 text-sm"
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
          className="bg-blue-600 text-white px-6 py-3 rounded w-full font-semibold"
        >
          Submit & Predict Risk
        </button>
      </div>
    </AdminLayout>
  );
};

export default ManualEntry;
