import { useEffect, useState } from "react";
import API from "../../api/api";
import { Plus, Trash2, Building2, Users, AlertCircle, X } from "lucide-react";
import { toast } from "react-toastify";


  console.log("ENV base URL:", process.env.REACT_APP_API_URL);
  console.log("Axios base URL:", API.defaults.baseURL);


export default function Halls() {
  const [hallName, setHallName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [halls, setHalls] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [hallToDelete, setHallToDelete] = useState(null);

  const loadHalls = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/halls/gethalls", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHalls(res.data);
    } catch (err) {
      toast.error("Failed to load halls");
    }
  };

  const addHall = async () => {
    if (!hallName.trim() || !capacity) {
      toast.warning("Please enter hall name and capacity");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/halls/create",
        { hallName, capacity: Number(capacity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Hall added successfully 🎉");
      setHallName("");
      setCapacity("");
      loadHalls();
    } catch (err) {
      toast.error("Failed to add hall");
    }
  };

  const openDeleteModal = (hall) => {
    setHallToDelete(hall);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setHallToDelete(null);
  };

  const confirmDelete = async () => {
    if (!hallToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/halls/delete/${hallToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Hall deleted successfully");
      closeModal();
      loadHalls();
    } catch (err) {
      toast.error("Failed to delete hall");
    }
  };

  useEffect(() => {
    loadHalls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Halls Management
          </h2>
          <p className="text-gray-600 text-lg">
            Create and manage examination halls
          </p>
        </div>

        {/* Add Hall Section */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 hover:shadow-3xl transition-shadow duration-300 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Add New Hall</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="relative group">
              <input
                value={hallName}
                placeholder="Hall Name"
                onChange={(e) => setHallName(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              <Building2 className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>

            <div className="relative group">
              <input
                type="number"
                value={capacity}
                placeholder="Capacity"
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              <Users className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>

            <button
              onClick={addHall}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl py-3 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Hall
              <span className="text-xl">✨</span>
            </button>
          </div>
        </div>

        {/* Halls Grid */}
        {halls.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {halls.map((h, index) => (
              <div
                key={h._id}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {h.hallName}
                    </h3>
                  </div>

                  <div className="bg-blue-50/80 rounded-xl p-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Capacity:</span>
                      <strong className="text-lg text-blue-700">
                        {h.capacity}
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => openDeleteModal(h)}
                    className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg flex items-center justify-center"
                    title="Delete Hall"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {halls.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No halls added yet. Create your first hall above!
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transform animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Confirm Deletion
                  </h3>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <p className="text-gray-700 text-lg">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-red-600">
                    {hallToDelete?.hallName}
                  </span>
                  ?
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 hover:scale-105 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
