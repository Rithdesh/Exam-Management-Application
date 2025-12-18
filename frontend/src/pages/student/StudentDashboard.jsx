import { useEffect, useState } from "react";
import API from "../../api/api";
import { FaUniversity, FaBook } from "react-icons/fa";
import { FiSearch, FiMapPin, FiCalendar, FiClock, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [rollNo, setRollNo] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    API.get("/examination/getall")
      .then((res) => setExams(res.data))
      .catch(() => toast.error("Unable to load exams"));
  }, []);

  const findSeat = async (examId) => {
    if (!rollNo) {
      toast.warning("Please enter your Roll Number");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await API.get(
        `/SeatingPlan/${examId}/roll/${rollNo}`
      );

      console.log(res.data);

      if (!res.data?.seatingDetails) {
        toast.info("Seat not allocated yet. Please check later.");
        return;
      }

      setResult(res.data.seatingDetails);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      toast.info("Seat not allocated yet. Please check later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className=" py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <span className="text-4xl">🎓</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Student Dashboard
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find your examination seating allocation instantly
            </p>
          </div>

          {/* Roll Number Input Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <FiSearch className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Enter Your Roll Number
                  </h3>
                  <p className="text-sm text-gray-600">
                    Find your seat allocation for any exam
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter your roll number"
                  value={rollNo}
                  onChange={(e) => setRollNo(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 text-lg focus:outline-none focus:border-indigo-500 focus:bg-white bg-gray-50 transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">#</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Examinations Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                Available Examinations
              </h2>
            </div>

            {exams.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/20">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                  <span className="text-5xl opacity-50">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No Examinations Available
                </h3>
                <p className="text-gray-600">
                  Examinations will appear here once scheduled
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                  <div
                    key={exam._id}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300 group"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                      <div className="relative flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                          <FaBook className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/80 text-xs font-medium mb-1">
                            Examination
                          </p>
                          <h3 className="text-lg font-bold text-white truncate">
                            {exam.examName}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {/* Date */}
                      {exam.date && (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <FiCalendar className="text-white" size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Date
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {new Date(exam.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Duration */}
                      {exam.durationMinutes && (
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                            <FiClock className="text-white" size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Duration
                            </p>
                            <p className="text-sm font-bold text-gray-800">
                              {exam.durationMinutes} minutes
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Find Seat Button */}
                      <button
                        disabled={!rollNo || loading}
                        onClick={() => findSeat(exam._id)}
                        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl py-3.5 font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Searching...</span>
                          </>
                        ) : (
                          <>
                            <FiMapPin size={18} />
                            <span>Find My Seat</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Result Modal */}
        {showModal && result && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-200"
            onClick={() => setShowModal(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full relative animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <FiX size={20} />
              </button>

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl">✅</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Seat Allocation Found!
                    </h3>
                    <p className="text-white/80 text-sm">
                      Your seating details are below
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-5">
                {/* Roll Number */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-2xl font-bold text-white">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Roll Number
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {result.rollNumber}
                    </p>
                  </div>
                </div>

                {/* Subject */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Subject
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {result.subject}
                    </p>
                  </div>
                </div>

                {/* Hall */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <FaUniversity className="text-white text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Hall Location
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {result.hall}
                    </p>
                  </div>
                </div>

                {/* Hall Capacity */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Hall Capacity
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {result.hallCapacity} seats
                    </p>
                  </div>
                </div>

                {/* Roll Range */}
                <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="text-2xl font-bold text-white">📊</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Roll Number Range
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {result.rollRange.from} - {result.rollRange.to}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5">
      {icon && (
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md text-white">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
