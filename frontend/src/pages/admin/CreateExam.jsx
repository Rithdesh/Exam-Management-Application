import { useState } from "react";
import API from "../../api/api";
import { Plus, X, Calendar, Clock, BookOpen } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { toast } from "react-toastify";


export default function CreateExam() {
  const [examName, setExamName] = useState("");
  const [date, setDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");


  const [subjects, setSubjects] = useState([
    {
      subjectName: "",
      rollRanges: [{ from: "", to: "" }],
      individualRolls: [],
    },
  ]);

  /* ---------- Subject Handlers ---------- */

  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        subjectName: "",
        rollRanges: [{ from: "", to: "" }],
        individualRolls: [],
      },
    ]);
  };

  const removeSubject = (index) => {
    // Prevent removing the last remaining subject
    if (subjects.length === 1) return;

    const copy = subjects.filter((_, i) => i !== index);
    setSubjects(copy);
  };

  const handleSubjectName = (index, value) => {
    const copy = [...subjects];
    copy[index].subjectName = value;
    setSubjects(copy);
  };

  const addRollRange = (sIndex) => {
    const copy = [...subjects];
    copy[sIndex].rollRanges.push({ from: "", to: "" });
    setSubjects(copy);
  };

  const handleRollRange = (sIndex, rIndex, field, value) => {
    const copy = [...subjects];
    copy[sIndex].rollRanges[rIndex][field] = Number(value);
    setSubjects(copy);
  };

  const handleIndividualRolls = (sIndex, value) => {
    const copy = [...subjects];
    copy[sIndex].individualRolls = value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));
    setSubjects(copy);
  };

  /* ---------- Actions ---------- */

  const createExam = async () => {
    try {
      await API.post("/examination/create", {
        examName,
        date,
        durationMinutes: Number(durationMinutes),
        subjects,
      });

      toast.success("Examination created successfully 🎉");

      handleCancelAll();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Exam creation failed ❌");
    }
  };



  const handleCancelAll = () => {
    setExamName("");
    setDate("");
    setDurationMinutes("");
    setSubjects([
      {
        subjectName: "",
        rollRanges: [{ from: "", to: "" }],
        individualRolls: [],
      },
    ]);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen ">
        <div className="max-w-6xl mx-auto">
          {/* Animated Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Create Examination
            </h1>
            <p className="text-gray-600 text-lg">
              Define exam details and assign subjects to students
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 hover:shadow-3xl transition-shadow duration-300">
            {/* Exam Details Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Exam Details
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="relative group">
                  <input
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    placeholder="Exam Name"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="relative group">
                  <input
                    type="date"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="relative group">
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                  />
                  <Clock className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Subjects Section */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Subjects</h3>
              </div>

              <div className="space-y-6">
                {subjects.map((subject, sIndex) => (
                  <div
                    key={sIndex}
                    className="bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative group"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {sIndex + 1}
                        </div>
                        <input
                          className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all duration-300 bg-white/80"
                          placeholder="Subject Name"
                          value={subject.subjectName}
                          onChange={(e) =>
                            handleSubjectName(sIndex, e.target.value)
                          }
                        />
                      </div>

                      {/* Roll Ranges */}
                      <div className="mb-5 bg-blue-50/50 rounded-xl p-4">
                        <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Roll Ranges
                        </p>

                        {subject.rollRanges.map((range, rIndex) => (
                          <div key={rIndex} className="flex gap-3 mb-3">
                            <input
                              type="number"
                              placeholder="From"
                              className="w-1/2 rounded-lg border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
                              value={range.from}
                              onChange={(e) =>
                                handleRollRange(
                                  sIndex,
                                  rIndex,
                                  "from",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="number"
                              placeholder="To"
                              className="w-1/2 rounded-lg border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all bg-white"
                              value={range.to}
                              onChange={(e) =>
                                handleRollRange(
                                  sIndex,
                                  rIndex,
                                  "to",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}

                        <button
                          onClick={() => addRollRange(sIndex)}
                          className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:text-blue-700 hover:gap-3 transition-all duration-300"
                        >
                          <Plus className="w-4 h-4" />
                          Add Range
                        </button>
                      </div>

                      {/* Individual Rolls */}
                      <div className="bg-purple-50/50 rounded-xl p-4">
                        <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          Individual Rolls
                        </p>
                        <input
                          className="w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none transition-all bg-white"
                          placeholder="101, 108, 115"
                          onChange={(e) =>
                            handleIndividualRolls(sIndex, e.target.value)
                          }
                        />
                      </div>

                      {subjects.length > 1 && (
                        <button
                          onClick={() => removeSubject(sIndex)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full hover:scale-110 hover:rotate-90 transition-all duration-300 shadow-lg flex items-center justify-center group"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addSubject}
                className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Subject
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
              <button
                onClick={handleCancelAll}
                className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 hover:scale-105 transition-all duration-300"
              >
                Cancel
              </button>

              <button
                onClick={createExam}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Create Examination
                <span className="text-xl">✨</span>
              </button>
            </div>
          </div>
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
        `}</style>
      </div>
    </DashboardLayout>
  );
}
