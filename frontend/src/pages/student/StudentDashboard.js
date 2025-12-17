import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaUniversity, FaBook } from "react-icons/fa";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/examination/getall")
      .then(res => setExams(res.data))
      .catch(() => setMessage("Unable to load exams"));
  }, []);

  const findSeat = async (examId) => {
    setResult(null);
    setMessage("");

    if (!rollNo) {
      setMessage("Please enter your Roll Number");
      return;
    }

    try {
      const res = await API.get(`/examination/seatingplan/${examId}`);

      if (!res.data?.seatingPlan) {
        setMessage("Seat not allocated yet. Please check later.");
        return;
      }

      const seatingPlan = res.data.seatingPlan;
      let found = false;

      seatingPlan.classrooms.forEach(room => {
        room.allocations.forEach(alloc => {
          alloc.rollRanges.forEach(range => {
            if (rollNo >= range.from && rollNo <= range.to && !found) {
              setResult({
                exam: seatingPlan.examination,
                hall: room.hall.hallName,
                subject: alloc.subjectName,
                rollRange: `${range.from} - ${range.to}`
              });
              found = true;
            }
          });
        });
      });

      if (!found) {
        setMessage("Seat not allocated yet. Please check later.");
      }

    } catch {
      setMessage("Seat not allocated yet. Admin may not have allocated.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1>🎓 Student Dashboard</h1>
        <p className="subtitle">Check your examination seating allocation</p>

        <input
          className="roll-input"
          type="number"
          placeholder="Enter Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(Number(e.target.value))}
        />

        <h2>Examinations</h2>

        <div className="exams-grid">
          {exams.map(exam => (
            <div key={exam._id} className="exam-card">
              <FaBook className="exam-icon" />
              <h3>{exam.examName}</h3>
              <button onClick={() => findSeat(exam._id)}>
                Find My Seat
              </button>
            </div>
          ))}
        </div>

        {result && (
          <div className="result-card">
            <h3>📌 Seat Allocation</h3>
            <p><strong>Exam:</strong> {result.exam.examName}</p>
            <p><FaUniversity /> <strong>Hall:</strong> {result.hall}</p>
            <p><strong>Subject:</strong> {result.subject}</p>
            <p><strong>Roll Range:</strong> {result.rollRange}</p>
          </div>
        )}

        {message && <p className="info-message">{message}</p>}
      </div>
    </div>
  );
}