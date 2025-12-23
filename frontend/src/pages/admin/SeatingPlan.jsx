import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";
import { FiTrash2, FiDownload, FiX } from "react-icons/fi";
import DashBoardLayout from "../../components/DashboardLayout";

export default function SeatingPlan() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await API.get(`/SeatingPlan/getall`);
      setPlans(res.data.seatingPlans || []);
    } catch (err) {
      toast.error("Failed to load seating plans");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* ---------------- Open / Close Modal ---------------- */
  const openDeleteModal = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
  };

  /* ---------------- Delete Seating Plan ---------------- */
  const confirmDelete = async () => {
    if (!selectedPlan) return;

    try {
      await API.delete(`/SeatingPlan/delete/${selectedPlan._id}`);
      toast.success("Seating plan deleted successfully");
      closeDeleteModal();
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete seating plan");
      console.error(err);
    }
  };

  /* ---------------- Download PDF ---------------- */
  const downloadPDF = async (id, examName) => {
    try {
      const res = await API.get(`/SeatingPlan/exportpdf/${id}`, {
        responseType: "blob",
        headers: {
          Accept: "application/pdf",
        },
      });

      // Create blob from the response
      const blob = new Blob([res.data], { type: "application/pdf" });

      // Create a link element
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set the download attributes
      link.href = downloadUrl;
     link.download = "SeatingPlan.pdf";

      link.style.display = "none";

      // Add to the DOM, trigger download, and clean up
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
      }, 100);

      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("PDF download error:", err);

      if (err.response?.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          toast.error(json.message || "PDF generation failed");
        } catch {
          toast.error("PDF generation failed");
        }
      } else {
        toast.error("Failed to download PDF");
      }
    }
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <DashBoardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading seating plans...</p>
          </div>
        </div>
      </DashBoardLayout>
    );
  }

  return (
    <DashBoardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-6">
              <span className="text-4xl">🪑</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Seating Plans
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              View and manage examination seating arrangements
            </p>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-white/20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                <span className="text-5xl opacity-50">🪑</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Seating Plans Yet
              </h3>
              <p className="text-gray-600">
                Seating plans will appear here once they are created
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {plans.map((plan, index) => (
                <div
                  key={plan._id}
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {plan.examination?.examName || `Exam ${index + 1}`}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {plan.classrooms?.length || 0} classroom(s) allocated
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            downloadPDF(plan._id, plan.examination?.examName)
                          }
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/30"
                        >
                          <FiDownload size={18} />
                          <span className="font-medium">Export PDF</span>
                        </button>

                        <button
                          onClick={() => openDeleteModal(plan)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/90 text-white hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <FiTrash2 size={18} />
                          <span className="font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Classrooms */}
                  <div className="p-8">
                    {Array.isArray(plan.classrooms) &&
                    plan.classrooms.length > 0 ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {plan.classrooms.map((room, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-100"
                          >
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-indigo-200">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                                {i + 1}
                              </div>
                              <h4 className="font-bold text-lg text-gray-800">
                                {room.hall?.hallName || "Unknown Hall"}
                              </h4>
                            </div>

                            {Array.isArray(room.allocations) &&
                            room.allocations.length > 0 ? (
                              <div className="space-y-2">
                                {room.allocations.map((a, j) => (
                                  <div
                                    key={j}
                                    className="flex justify-between items-center bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <span className="font-medium text-gray-700 text-sm">
                                      {a.subjectName}
                                    </span>
                                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                      {a.count}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6">
                                <p className="text-gray-500 text-sm">
                                  No allocations available
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-md">
                          <span className="text-3xl opacity-50">📋</span>
                        </div>
                        <p className="text-gray-600 font-medium">
                          No classrooms allocated for this exam
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------------- DELETE CONFIRMATION MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-5 relative">
              <button
                onClick={closeDeleteModal}
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
                    Are you sure you want to delete the seating plan for
                  </p>
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedPlan?.examination?.examName}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Delete Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashBoardLayout>
  );
}
