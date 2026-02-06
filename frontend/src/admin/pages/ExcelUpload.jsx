import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../layout/AdminLayout";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  // open file explorer manually
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // store selected file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null); // Clear previous results
  };

  // upload excel
  const handleUpload = async () => {
    if (!file) {
      alert("Please select an Excel file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setResult(null);

      const response = await api.post("/admin/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(response.data);
      setFile(null);
      
      // Auto-navigate to students page after 2 seconds
      setTimeout(() => {
        navigate("/admin/students");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Upload failed. Check file format and columns.";
      setResult({ error: errorMsg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Excel Upload</h2>
        <p className="text-gray-600">Bulk import and generate risk predictions</p>
      </div>

      <div className="glass-card p-6 rounded-2xl max-w-3xl">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
          <h3 className="font-semibold mb-2">Excel Format (Dynamic Subjects)</h3>
          <p className="text-sm text-gray-700 mb-2">
            Your Excel must have these columns:
          </p>
          <code className="block bg-white p-2 rounded text-xs mb-2 border border-blue-100">
            name, attendance, behaviour, fees_paid, subject, marks
          </code>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Multiple rows per student</strong> for different subjects:
          </p>
          <table className="text-xs border w-full rounded overflow-hidden">
            <thead className="bg-blue-100">
              <tr>
                <th className="border p-1">name</th>
                <th className="border p-1">attendance</th>
                <th className="border p-1">behaviour</th>
                <th className="border p-1">fees_paid</th>
                <th className="border p-1">subject</th>
                <th className="border p-1">marks</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="border p-1">Rahul</td>
                <td className="border p-1">75</td>
                <td className="border p-1">60</td>
                <td className="border p-1">TRUE</td>
                <td className="border p-1">Math</td>
                <td className="border p-1">70</td>
              </tr>
              <tr>
                <td className="border p-1">Rahul</td>
                <td className="border p-1">75</td>
                <td className="border p-1">60</td>
                <td className="border p-1">TRUE</td>
                <td className="border p-1">DBMS</td>
                <td className="border p-1">65</td>
              </tr>
              <tr>
                <td className="border p-1">Rahul</td>
                <td className="border p-1">75</td>
                <td className="border p-1">60</td>
                <td className="border p-1">TRUE</td>
                <td className="border p-1">AI</td>
                <td className="border p-1">80</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hidden real file input */}
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Visible button to open explorer */}
        <button
          onClick={openFilePicker}
          className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg w-full mb-4 border border-gray-200 transition"
        >
          Select Excel File
        </button>

        {/* show selected file */}
        {file && (
          <p className="text-emerald-600 mb-4 text-sm">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        {/* Show upload results */}
        {result && (
          <div className={`mb-4 p-4 rounded-xl border ${
            result.error 
              ? "bg-red-50 border-red-200" 
              : "bg-green-50 border-green-200"
          }`}>
            {result.error ? (
              <p className="text-red-700 text-sm font-semibold">{result.error}</p>
            ) : (
              <div>
                <p className="text-green-700 font-semibold mb-2">
                  {result.message}
                </p>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✅ Added: {result.students_added} students</p>
                  <p>🔄 Updated: {result.students_updated} students</p>
                  <p>📊 Total Processed: {result.total_processed}</p>
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2 bg-yellow-50 p-2 rounded">
                      <p className="font-semibold">Warnings:</p>
                      {result.errors.map((err, idx) => (
                        <p key={idx} className="text-xs">{err}</p>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Redirecting to students page...
                </p>
              </div>
            )}
          </div>
        )}

        {/* upload */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-3 rounded-lg w-full shadow hover:shadow-lg transition disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload & Predict"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ExcelUpload;
