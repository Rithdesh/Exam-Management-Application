import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import "./AdminDashboard.css";
import { User } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="admin-wrapper">
      <header className="admin-top">
  <h1>
    🧑‍💼 Admin Dashboard
  </h1>
  <p>Control & manage the examination system</p>
</header>


      <div className="admin-grid">
        <Link to="/admin/subjects" className="glass-card">
          <span className="emoji">📘</span>
          <h3>Subjects</h3>
          <p>Create & organize subjects</p>
        </Link>

        <Link to="/admin/halls" className="glass-card">
          <span className="emoji">🏫</span>
          <h3>Halls</h3>
          <p>Manage hall capacity & layout</p>
        </Link>

        <Link to="/admin/create-exam" className="glass-card highlight">
          <span className="emoji">📝</span>
          <h3>Create Exam</h3>
          <p>Schedule a new examination</p>
        </Link>

        <Link to="/admin/exams" className="glass-card">
          <span className="emoji">📅</span>
          <h3>Exams</h3>
          <p>View & allocate seating</p>
        </Link>
      </div>
    </div>
  );
}
