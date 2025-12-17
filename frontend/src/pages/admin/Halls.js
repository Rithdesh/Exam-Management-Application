import { useEffect, useState } from "react";
import API from "../../api/api";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import "./Halls.css"; // Import the CSS file

export default function Halls() {
  const [hallName, setHallName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [halls, setHalls] = useState([]);

  const loadHalls = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/halls/gethalls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHalls(res.data);
    } catch (err) {
      console.error("Failed to load halls", err);
    }
  };

  const addHall = async () => {
    if (!hallName.trim() || !capacity) return alert("Please enter name and capacity");
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/halls/create",
        { hallName, capacity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHallName("");
      setCapacity("");
      loadHalls();
    } catch (err) {
      console.error("Failed to add hall", err);
    }
  };

  const deleteHall = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hall?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/halls/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadHalls();
    } catch (err) {
      console.error("Failed to delete hall", err);
    }
  };

  useEffect(() => {
    loadHalls();
  }, []);

  return (
    <div className="halls-container">
      <div className="halls-card">
        <h2>Halls Management</h2>

        <div className="halls-form">
          <input
            value={hallName}
            placeholder="Hall Name"
            onChange={(e) => setHallName(e.target.value)}
          />
          <input
            type="number"
            value={capacity}
            placeholder="Capacity"
            onChange={(e) => setCapacity(e.target.value)}
          />
          <button className="add-button" onClick={addHall}>
            <FiPlus /> Add Hall
          </button>
        </div>

        <div className="halls-grid">
          {halls.map((h) => (
            <div key={h._id} className="hall-card">
              <h3>{h.hallName}</h3>
              <p>Capacity: {h.capacity}</p>
              <button
                className="delete-button"
                onClick={() => deleteHall(h._id)}
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
