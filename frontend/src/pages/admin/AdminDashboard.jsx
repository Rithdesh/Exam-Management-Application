import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

export default function AdminDashboard() {
  const dashboardItems = [
    {
      title: "Subjects",
      icon: "📘",
      description: "Create & organize subjects",
      link: "/admin/subjects",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      hoverGradient: "group-hover:from-blue-500 group-hover:to-cyan-500",
    },
    {
      title: "Halls",
      icon: "🏫",
      description: "Manage hall capacity & layout",
      link: "/admin/halls",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      hoverGradient: "group-hover:from-emerald-500 group-hover:to-teal-500",
    },
    {
      title: "Create Exam",
      icon: "📝",
      description: "Schedule a new examination",
      link: "/admin/create-exam",
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
      hoverGradient: "group-hover:from-indigo-500 group-hover:to-purple-500",
    },
    {
      title: "Exams",
      icon: "📅",
      description: "View & allocate seating",
      link: "/admin/exams",
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
      hoverGradient: "group-hover:from-rose-500 group-hover:to-pink-500",
    },
    {
      title: "Seating Plan",
      icon: "🪑",
      description: "View hall-wise seating arrangements",
      link: "/admin/seating-plan",
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
      hoverGradient: "group-hover:from-amber-500 group-hover:to-orange-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
              <span className="text-5xl">🧑‍💼</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Control & manage the examination system with ease
            </p>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              <div className="h-1 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 overflow-hidden transform hover:-translate-y-2"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-700"></div>

                {/* Content */}
                <div className="relative p-8 flex flex-col items-center text-center">
                  {/* Icon Container */}
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.bgGradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 ${item.hoverGradient}`}
                  >
                    <span className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-white mb-3 transition-colors duration-300">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 group-hover:text-white/90 transition-colors duration-300 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Arrow Indicator */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-medium">Explore</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
