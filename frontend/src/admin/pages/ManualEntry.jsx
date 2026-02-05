import { useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import axios from "axios";

const ManualEntry = () => {
  const [form, setForm] = useState({
    name: "",
    attendance: "",
    marks: "",
    behaviour: "",
    fees_paid: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async () => {
    try {
      // Prepare payload with proper types
      const payload = {
        name: form.name,
        attendance: parseFloat(form.attendance),
        marks: parseFloat(form.marks),
        behaviour: parseFloat(form.behaviour),
        fees_paid: !!form.fees_paid,
      };

      const res = await axios.post(
        "http://localhost:8000/admin/add-student",
        payload
      );

      // Backend returns risk_level and probability
      const riskLabel = res?.data?.risk_level ?? "N/A";
      const probability = res?.data?.probability ?? 0;
      alert(`Risk Level: ${riskLabel} (${probability.toFixed(1)}%)`);
    } catch (err) {
      alert("Error submitting data");
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-6">Manual Student Entry</h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <input
          name="name"
          placeholder="Student Name"
          className="w-full p-3 border mb-4"
          onChange={handleChange}
        />

        <input
          name="attendance"
          placeholder="Attendance %"
          className="w-full p-3 border mb-4"
          onChange={handleChange}
        />

        <input
          name="marks"
          placeholder="Marks %"
          className="w-full p-3 border mb-4"
          onChange={handleChange}
        />

        <input
          name="behaviour"
          placeholder="Behaviour Score"
          className="w-full p-3 border mb-4"
          onChange={handleChange}
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            name="fees_paid"
            onChange={handleChange}
          />
          Fees Paid
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Submit & Predict Risk
        </button>
      </div>
    </AdminLayout>
  );
};

export default ManualEntry;
