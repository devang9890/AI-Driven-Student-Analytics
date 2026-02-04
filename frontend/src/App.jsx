import { useEffect, useState } from "react";
import api from "./api/axios";
import StudentDetail from "./pages/StudentDetail.jsx";

export default function App() {
	const [students, setStudents] = useState([]);
	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		api.get("/students")
			.then(res => {
				setStudents(res.data || []);
				if (res.data && res.data.length > 0) {
					setSelectedId(res.data[0].id);
				}
			})
			.catch(err => console.error(err));
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">StudentDriven Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1 p-4 bg-white rounded-xl shadow-md">
					<h2 className="text-lg font-semibold mb-3">Students</h2>
					<ul className="space-y-2">
						{students.map((s) => (
							<li key={s.id}>
								<button
									className={`w-full text-left p-3 rounded ${selectedId === s.id ? "bg-blue-50" : "bg-gray-100"}`}
									onClick={() => setSelectedId(s.id)}
								>
									<span className="font-medium">{s.name}</span>
									<span className="text-gray-600"> — {s.department}</span>
								</button>
							</li>
						))}
						{students.length === 0 && (
							<li className="text-gray-500">No students yet.</li>
						)}
					</ul>
				</div>

				<div className="md:col-span-2">
					{selectedId ? (
						<StudentDetail studentId={selectedId} />
					) : (
						<div className="p-6 bg-white rounded-xl shadow-md">
							<p className="text-gray-600">Select a student to view details.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
