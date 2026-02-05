import { useState, useRef } from "react";
import axios from "axios";
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

      await axios.post(
        "http://localhost:8000/admin/upload-excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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

      <div className="bg-white p-6 rounded-xl shadow max-w-md">

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
