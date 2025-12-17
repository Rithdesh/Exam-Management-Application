import { useEffect, useState } from "react";
import API from "../../api/api";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import "./Subjects.css"; // Import the CSS file

export default function Subjects() {
  const [name, setName] = useState("");
  const [code, setCode] = useState(""); // New state for subject code
  const [subjects, setSubjects] = useState([]);

  const loadSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/subject/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      alert("Failed to load subjects");
      console.error(err);
    }
  };

  const addSubject = async () => {
    if (!name.trim() || !code.trim()) {
      return alert("Please enter both Subject Name and Code");
    }
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/subject/create",
        { name, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setCode("");
      loadSubjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add subject");
      console.error(err);
    }
  };

const deleteSubject = async (id) => {
  console.log("Deleting subject ID:", id); // 🔍 debug

  if (!window.confirm("Are you sure you want to delete this subject?")) return;

  try {
    const token = localStorage.getItem("token");

    await API.delete(`/subject/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Subject deleted successfully");
    loadSubjects(); // refresh list
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Failed to delete subject");
  }
};


  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div className="subjects-container">
      <div className="subjects-card">
        <h2>Subjects Dashboard</h2>

        <div className="subjects-form">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Subject Name"
          />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter Subject Code"
          />
          <button className="add-button" onClick={addSubject}>
            <FiPlus /> Add Subject
          </button>
        </div>

        <div className="subjects-grid">
          {subjects.map((s) => (
            <div key={s._id} className="subject-card">
              <h3>{s.name}</h3>
              <p>Code: {s.code || "N/A"}</p>
              <button
                className="delete-button"
                onClick={() => deleteSubject(s._id)}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
