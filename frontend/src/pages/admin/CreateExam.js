import { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import "./CreateExam.css"; // Import CSS

export default function CreateExam() {
  const navigate = useNavigate();

  const [examName, setExamName] = useState("");
  const [date, setDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");

  const [subjects, setSubjects] = useState([
    { subjectName: "", rollRanges: [{ from: "", to: "" }], individualRolls: [] }
  ]);

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { subjectName: "", rollRanges: [{ from: "", to: "" }], individualRolls: [] }
    ]);
  };

  const handleSubjectName = (index, value) => {
    const copy = [...subjects];
    copy[index].subjectName = value;
    setSubjects(copy);
  };

  const addRollRange = (sIndex) => {
    const copy = [...subjects];
    copy[sIndex].rollRanges.push({ from: "", to: "" });
    setSubjects(copy);
  };

  const handleRollRange = (sIndex, rIndex, field, value) => {
    const copy = [...subjects];
    copy[sIndex].rollRanges[rIndex][field] = Number(value);
    setSubjects(copy);
  };

  const handleIndividualRolls = (sIndex, value) => {
    const copy = [...subjects];
    copy[sIndex].individualRolls = value
      .split(",")
      .map(v => Number(v.trim()))
      .filter(v => !isNaN(v));
    setSubjects(copy);
  };

  const createExam = async () => {
    try {
      await API.post("/examination/create", {
        examName,
        date,
        durationMinutes: Number(durationMinutes),
        subjects
      });

      alert("Examination created successfully");
      navigate("/admin/exams");
    } catch (error) {
      alert(error.response?.data?.message || "Exam creation failed");
    }
  };

  return (
  <div className="exam-page">
    <div className="exam-card">
      <h1>Create Examination</h1>
      <p className="subtitle">Define exam details and assign subjects</p>

      {/* Exam Info */}
      <div className="section">
        <h3>Exam Details</h3>
        <div className="grid">
          <input
            placeholder="Exam Name"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects */}
      <div className="section">
        <h3>Subjects</h3>

        {subjects.map((subject, sIndex) => (
          <div className="subject-box" key={sIndex}>
            <input
              className="full-input"
              placeholder="Subject Name"
              value={subject.subjectName}
              onChange={(e) =>
                handleSubjectName(sIndex, e.target.value)
              }
            />

            <div className="roll-section">
              <label>Roll Ranges</label>
              {subject.rollRanges.map((range, rIndex) => (
                <div className="roll-row" key={rIndex}>
                  <input
                    type="number"
                    placeholder="From"
                    value={range.from}
                    onChange={(e) =>
                      handleRollRange(sIndex, rIndex, "from", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="To"
                    value={range.to}
                    onChange={(e) =>
                      handleRollRange(sIndex, rIndex, "to", e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                className="link-btn"
                onClick={() => addRollRange(sIndex)}
              >
                + Add Range
              </button>
            </div>

            <label>Individual Rolls</label>
            <input
              className="full-input"
              placeholder="101, 108, 115"
              onChange={(e) =>
                handleIndividualRolls(sIndex, e.target.value)
              }
            />
          </div>
        ))}

        <button className="secondary-btn" onClick={addSubject}>
          + Add Subject
        </button>
      </div>

      <button className="primary-btn" onClick={createExam}>
        Create Examination
      </button>
    </div>
  </div>
);
}