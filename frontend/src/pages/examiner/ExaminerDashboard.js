import { useEffect, useState } from "react";
import API from "../../api/api";
import { jwtDecode } from "jwt-decode";

import "./ExaminerDashboard.css";

export default function ExaminerDashboard() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [seatingPlan, setSeatingPlan] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ decode examiner hall
  const decoded = jwtDecode(token);
  const examinerHallId = decoded.hallId; // 🔥 MUST exist in token

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await API.get("/examination/getall", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExams(res.data);
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };
    fetchExams();
  }, [token]);

  const viewSeatingPlan = async (examId) => {
    try {
      const res = await API.get(`/examination/seatingplan/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ FILTER ONLY EXAMINER HALL
      const filteredClassrooms = res.data.seatingPlan.classrooms.filter(
        (room) => room.hall._id === examinerHallId
      );

      setSelectedExam(examId);
      setSeatingPlan({
        ...res.data.seatingPlan,
        classrooms: filteredClassrooms,
      });
    } catch (err) {
      alert("Seating plan not available");
      console.error(err);
    }
  };

  const downloadPDF = async (examId) => {
    try {
      const res = await API.get(`/examination/exportpdf/${examId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `SeatingPlan-${examId}.pdf`;
      link.click();
    } catch {
      alert("PDF not available");
    }
  };

  return (
    <div className="examiner-wrapper">
      <div className="examiner-container">
        <h1>🧑‍🏫 Examiner Dashboard</h1>
        <p className="subtitle">Your Hall Schedule Only</p>

        <div className="exam-grid">
          {exams.map((exam) => (
            <div key={exam._id} className="exam-card">
              <h3>{exam.examName}</h3>

              <div className="btn-group">
                <button onClick={() => viewSeatingPlan(exam._id)}>
                  View My Hall
                </button>
                <button
                  className="outline"
                  onClick={() => downloadPDF(exam._id)}
                >
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {seatingPlan && seatingPlan.classrooms.length === 0 && (
          <p className="warning">
            ❌ No seating allocated for your hall in this exam
          </p>
        )}

        {seatingPlan && seatingPlan.classrooms.length > 0 && (
          <div className="seating-section">
            <h2>
              Seating Plan –{" "}
              {exams.find((e) => e._id === selectedExam)?.examName}
            </h2>

            {seatingPlan.classrooms.map((room, i) => (
              <div key={i} className="hall-card">
                <h4>
                  Hall: {room.hall.hallName}
                  <span> (Capacity {room.capacityAtAllocation})</span>
                </h4>

                {room.allocations.map((alloc, j) => (
                  <div key={j} className="allocation-block">
                    <strong>{alloc.subjectName}</strong>
                    <ul>
                      {alloc.rollRanges.map((r, k) => (
                        <li key={k}>
                          {r.from} – {r.to} ({r.count} students)
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}