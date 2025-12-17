import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiCheckSquare } from "react-icons/fi";
import "./Exams.css";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const loadExams = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/examination/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      alert("Failed to load exams");
      console.error(err);
    }
  };

  const allocate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.post(`/examination/allocate/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/admin/seating/${id}`);
    } catch (err) {
      alert("Allocation failed");
      console.error(err);
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/examination/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadExams();
    } catch (err) {
      alert("Failed to delete exam");
      console.error(err);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <div className="exams-container">
      <h2>Examinations Dashboard</h2>
      <div className="exams-grid">
        {exams.map((exam) => (
          <div key={exam._id} className="exam-card">
            <div className="exam-info">
              <h3>{exam.examName}</h3>
              <p><strong>Date:</strong> {new Date(exam.date).toLocaleDateString()}</p>
              <p><strong>Duration:</strong> {exam.durationMinutes} min</p>
            </div>

            <div className="exam-actions">
              <button className="allocate-button" onClick={() => allocate(exam._id)}>
                <FiCheckSquare /> Allocate
              </button>
              <button className="delete-button" onClick={() => deleteExam(exam._id)}>
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
