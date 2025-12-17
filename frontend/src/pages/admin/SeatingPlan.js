import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/api";
import "./SeatingPlan.css"; // Import CSS

export default function SeatingPlan() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    API.get(`/examination/seatingplan/${id}`)
      .then(res => setPlan(res.data.seatingPlan))
      .catch(err => console.error(err));
  }, [id]);

  const downloadPDF = async () => {
    try {
      const response = await API.get(
        `/examination/exportpdf/${id}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "SeatingPlan.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("PDF download failed");
      console.error(error);
    }
  };

  if (!plan) return <p className="loading">Loading...</p>;

  return (
    <div className="seating-container">
      <h2>Seating Plan</h2>

      <div className="classrooms-grid">
        {plan.classrooms.map((c, i) => (
          <div key={i} className="classroom-card">
            <h3>{c.hall.hallName}</h3>
            <div className="allocations-list">
              {c.allocations.map((a, j) => (
                <p key={j}>
                  <span className="subject-name">{a.subjectName}</span> - <span className="count">{a.count}</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="download-btn" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
  );
}
