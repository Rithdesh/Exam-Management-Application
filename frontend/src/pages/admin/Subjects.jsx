import { useEffect, useState } from "react";
import API from "../../api/api";
import { Plus, Trash2, BookOpen, Code, AlertCircle, X } from "lucide-react";
import { toast } from "react-toastify";

export default function Subjects() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [subjects, setSubjects] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  /* ---------------- Load Subjects ---------------- */
  const loadSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/subject/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (err) {
      toast.error("Failed to load subjects");
    }
  };

  /* ---------------- Add Subject ---------------- */
  const addSubject = async () => {
    if (!name.trim() || !code.trim()) {
      toast.warning("Please enter subject name and code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/subject/create",
        { name, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Subject added successfully 🎉");
      setName("");
      setCode("");
      loadSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add subject");
    }
  };

  /* ---------------- Delete Subject ---------------- */
  const openDeleteModal = (subject) => {
    setSubjectToDelete(subject);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubjectToDelete(null);
  };

  const confirmDelete = async () => {
    if (!subjectToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await API.delete(`/subject/delete/${subjectToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Subject deleted successfully");
      closeModal();
      loadSubjects();
    } catch (err) {
      toast.error("Failed to delete subject");
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Subjects Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Create and manage academic subjects
          </p>
        </div>

        {/* Add Subject */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              Add New Subject
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Subject Name"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-green-200 focus:border-green-500 outline-none bg-white/80"
              />
              <BookOpen className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Subject Code"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 outline-none bg-white/80"
              />
              <Code className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>

            <button
              onClick={addSubject}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-xl py-3 font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Subject ✨
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {subjects.map((s, index) => (
              <div
                key={s._id}
                className="bg-gradient-to-br from-white/90 to-gray-50/90 rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {s.name}
                  </h3>
                </div>

                <div className="bg-green-50/80 rounded-xl p-4 mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-600" />
                  <strong className="text-green-700">{s.code || "N/A"}</strong>
                </div>

                <button
                  onClick={() => openDeleteModal(s)}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full hover:scale-110 transition shadow-lg flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-3xl flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No subjects added yet.
            </p>
          </div>
        )}

        {/* Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Confirm Deletion
                  </h3>
                </div>
                <button onClick={closeModal}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <strong className="text-red-600">
                  {subjectToDelete?.name}
                </strong>{" "}
                ({subjectToDelete?.code})?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:shadow-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
