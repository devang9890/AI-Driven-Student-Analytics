import { useState, useRef } from "react";
import api from "../../api/axios";
import AdminLayout from "../layout/AdminLayout";

const ExcelUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // open file explorer manually
  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  // store selected file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

      await api.post("/admin/upload-excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Upload successful!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        "Upload failed. Check file format and columns."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold mb-6">Excel Upload</h2>

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <h3 className="font-semibold mb-2">📋 Excel Format (Dynamic Subjects)</h3>
          <p className="text-sm text-gray-700 mb-2">
            Your Excel must have these columns:
          </p>
          <code className="block bg-gray-100 p-2 rounded text-xs mb-2">
            name, attendance, behaviour, fees_paid, subject, marks
          </code>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Multiple rows per student</strong> for different subjects:
          </p>
          <table className="text-xs border w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">name</th>
                <th className="border p-1">attendance</th>
                <th className="border p-1">behaviour</th>
                <th className="border p-1">fees_paid</th>
                <th className="border p-1">subject</th>
                <th className="border p-1">marks</th>
              </tr>
            </thead>
            <tbody>
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
          className="bg-gray-200 px-6 py-3 rounded w-full mb-4"
        >
          Select Excel File
        </button>

        {/* show selected file */}
        {file && (
          <p className="text-green-600 mb-4">
            Selected file: <strong>{file.name}</strong>
          </p>
        )}

        {/* upload */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full"
        >
          {uploading ? "Uploading..." : "Upload & Predict"}
        </button>
      </div>
    </AdminLayout>
  );
};

export default ExcelUpload;
