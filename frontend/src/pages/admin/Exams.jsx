import { useEffect, useState } from "react";
import API from "../../api/api";
import {
  FiTrash2,
  FiCheckSquare,
  FiCalendar,
  FiClock,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/DashboardLayout";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  const loadExams = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/examination/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExams(res.data);
    } catch (err) {
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  };

  const allocate = async (id) => {
    try {
      const token = localStorage.getItem("token");
      toast.info("Allocating seating...");
      await API.post(
        `/examination/allocate/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Seating allocated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Allocation failed");
    }
  };

  const openDeleteModal = (exam) => {
    setExamToDelete(exam);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setExamToDelete(null);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/examination/delete/${examToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Exam deleted successfully");
      closeModal();
      loadExams();
    } catch {
      toast.error("Failed to delete exam");
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading examinations...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Examinations Dashboard
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage examinations and allocate seating arrangements
            </p>
          </div>

          {/* Empty State */}
          {exams.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                <span className="text-5xl opacity-50">📅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Examinations Yet
              </h3>
              <p className="text-gray-600">
                Create your first examination to get started
              </p>
            </div>
          ) : (
            /* Exams Grid */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => (
                <div
                  key={exam._id}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm font-medium">
                          Exam #{index + 1}
                        </span>
                        <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white truncate">
                        {exam.examName}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Date */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <FiCalendar className="text-white" size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Date
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {new Date(exam.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                        <FiClock className="text-white" size={18} />
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

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => allocate(exam._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <FiCheckSquare size={18} />
                        <span>Allocate</span>
                      </button>

                      <button
                        onClick={() => openDeleteModal(exam)}
                        className="flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        title="Delete Exam"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- Delete Confirmation Modal ---------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-5 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
              >
                <FiX size={22} />
              </button>
              <h3 className="text-2xl font-bold text-white pr-10">
                Confirm Deletion
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-700 text-base mb-2">
                    Are you sure you want to delete
                  </p>
                  <p className="font-bold text-gray-900 text-lg">
                    {examToDelete?.examName}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone and will remove all associated
                    data.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Delete Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
