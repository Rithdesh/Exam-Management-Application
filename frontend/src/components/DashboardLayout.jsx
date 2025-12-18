import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function DashboardLayout({ children }) {
    const navigate = useNavigate()
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: clear everything
      // localStorage.clear();

      navigate("/login");
    };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-white/70 backdrop-blur-md shadow px-6 py-4 flex justify-end gap-x-7 shrink-0">
        <Link
          to="/"
          className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition"
        >
          HOME
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>

      {/* Page Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default DashboardLayout;
