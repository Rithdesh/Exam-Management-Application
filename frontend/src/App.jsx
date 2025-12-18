import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Subjects from "./pages/admin/Subjects";
import Halls from "./pages/admin/Halls";
import CreateExam from "./pages/admin/CreateExam";
import Exams from "./pages/admin/Exams";
import SeatingPlan from "./pages/admin/SeatingPlan";

import StudentDashboard from "./pages/student/StudentDashboard";

import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin (ALL routes protected) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="ADMIN">
                <Routes>
                  <Route path="" element={<AdminDashboard />} />
                  <Route path="subjects" element={<Subjects />} />
                  <Route path="halls" element={<Halls />} />
                  <Route path="create-exam" element={<CreateExam />} />
                  <Route path="exams" element={<Exams />} />
                  <Route path="seating-plan" element={<SeatingPlan />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
