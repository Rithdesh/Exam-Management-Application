import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleAccess = (requiredRole, route) => {
    // Not logged in → go to login
    if (!user) {
      navigate("/login");
      return;
    }

    // Admin can access everything
    if (user.role.toLowerCase() === "admin") {
      navigate(route);
      return;
    }

    // Role matches → go to route
    if (user.role.toLowerCase() === requiredRole.toLowerCase()) {
      navigate(route);
      return;
    }

    // Role mismatch → back to login
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-row gap-5 h-full items-center justify-center">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
              Exam Hall Allocation System
            </h1>
            <p className="text-gray-600 text-xl">
              Smart seating. Zero chaos. No malpractice stress.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Admin */}
            <div
              onClick={() => handleAccess("admin", "/admin")}
              className="cursor-pointer bg-white/40 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300 border border-white/60"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Admin
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage exams, halls, subjects and seating plans with complete
                control.
              </p>
              <span className="text-indigo-600 font-medium">
                Access Portal →
              </span>
            </div>

            {/* Student */}
            <div
              onClick={() => handleAccess("student", "/student")}
              className="cursor-pointer bg-white/40 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl hover:bg-white/50 transition-all duration-300 border border-white/60"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Student
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Check exam details and seating allocation.
              </p>
              <span className="text-rose-600 font-medium">Access Portal →</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            Built for stress-free exam days ✨
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Home;
