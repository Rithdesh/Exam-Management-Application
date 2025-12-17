import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Subjects from "./pages/admin/Subjects";
import Halls from "./pages/admin/Halls";
import CreateExam from "./pages/admin/CreateExam";
import Exams from "./pages/admin/Exams";
import SeatingPlan from "./pages/admin/SeatingPlan";

import ExaminerDashboard from "./pages/examiner/ExaminerDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/subjects" element={<ProtectedRoute role="admin"><Subjects /></ProtectedRoute>} />
        <Route path="/admin/halls" element={<ProtectedRoute role="admin"><Halls /></ProtectedRoute>} />
        <Route path="/admin/create-exam" element={<ProtectedRoute role="admin"><CreateExam /></ProtectedRoute>} />
        <Route path="/admin/exams" element={<ProtectedRoute role="admin"><Exams /></ProtectedRoute>} />
        <Route path="/admin/seating/:id" element={<ProtectedRoute role="admin"><SeatingPlan /></ProtectedRoute>} />

        {/* EXAMINER */}
        <Route path="/examiner" element={
          <ProtectedRoute role="examiner">
            <ExaminerDashboard />
          </ProtectedRoute>
        } />

        {/* STUDENT */}
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
