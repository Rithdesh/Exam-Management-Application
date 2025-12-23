const Examination = require("../Models/Examination");
const Subject = require("../Models/Subject");

const createExamination = async (req, res) => {
  try {
    const { examName, date, durationMinutes, subjects } = req.body;

    /* ---------- Basic validation ---------- */
    if (
      !examName ||
      !date ||
      typeof durationMinutes !== "number" ||
      durationMinutes <= 0 ||
      !Array.isArray(subjects) ||
      subjects.length === 0
    ) {
      return res.status(400).json({
        message:
          "Exam name, date, durationMinutes, and at least one subject are required",
      });
    }

    /* ---------- Prevent past-date exams ---------- */
    const examDate = new Date(date);
    if (isNaN(examDate.getTime())) {
      return res.status(400).json({ message: "Invalid examination date" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (examDate < today) {
      return res.status(400).json({
        message: "Examination date cannot be in the past",
      });
    }

    /* ---------- Normalize subject names ---------- */
    const requestedSubjectNames = subjects.map(
      s => s.subjectName?.trim().toUpperCase()
    );

    if (requestedSubjectNames.includes(undefined)) {
      return res.status(400).json({
        message: "Each subject must contain a valid subjectName",
      });
    }

    /* ---------- Validate subjects against DB ---------- */
    const existingSubjects = await Subject.find({
      name: { $in: requestedSubjectNames },
    }).select("name");

    const existingSubjectNames = existingSubjects.map(s => s.name.toUpperCase());

    const invalidSubjects = requestedSubjectNames.filter(
      s => !existingSubjectNames.includes(s)
    );

    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        message: "Invalid subject(s) provided",
        invalidSubjects,
      });
    }

    /* ---------- Prevent duplicate exam on same date ---------- */
    const existingExam = await Examination.findOne({
      examName: examName.trim(),
      date: examDate,
    });

    if (existingExam) {
      return res.status(409).json({
        message: "Examination already exists for this date",
      });
    }

    /* ---------- Validate & normalize subjects ---------- */
    const formattedSubjects = subjects.map((s, sIndex) => {
      const rollRanges = Array.isArray(s.rollRanges) ? s.rollRanges : [];

      rollRanges.forEach((r, rIndex) => {
        const from = Number(r.from);
        const to = Number(r.to);

        if (
          !Number.isInteger(from) ||
          !Number.isInteger(to) ||
          from <= 0 ||
          to <= 0
        ) {
          throw new Error(
            `Invalid roll range values for subject ${s.subjectName} at range index ${rIndex}`
          );
        }

        if (from > to) {
          throw new Error(
            `Invalid roll range (from > to) for subject ${s.subjectName}: ${from} > ${to}`
          );
        }
      });

      return {
        subjectName: s.subjectName.trim().toUpperCase(),
        rollRanges: rollRanges.map(r => ({
          from: Number(r.from),
          to: Number(r.to),
        })),
        individualRolls: Array.isArray(s.individualRolls)
          ? s.individualRolls.map(Number)
          : [],
      };
    });

    /* ---------- Create examination ---------- */
    const exam = await Examination.create({
      examName: examName.trim(),
      date: examDate,
      durationMinutes,
      subjects: formattedSubjects,
    });

    res.status(201).json({
      message: "Examination created successfully",
      exam,
    });
  } catch (error) {
    console.error("createExamination error:", error.message);
    res.status(400).json({
      message: "Failed to create examination",
      error: error.message,
    });
  }
};



const getAllExaminations = async (req, res) => {
  try {
    const exams = await Examination.find(); // ❌ REMOVE populate
    res.status(200).json(exams);
  } catch (error) {
    console.error("getAllExaminations error:", error);
    res.status(500).json({ message: error.message });
  }
};



// UPDATE EXAMINATION
const updateExamination = async (req, res) => {
  try {
    const exam = await Examination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({ message: "Examination not found" });
    }

    res.status(200).json({
      message: "Examination updated successfully",
      exam
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EXAMINATION
const deleteExamination = async (req, res) => {
  try {
    const exam = await Examination.findByIdAndDelete(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Examination not found" });
    }

    res.status(200).json({ message: "Examination deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* -------- GET SEATING PLAN BY EXAM -------- */



module.exports = {
  createExamination,
  getAllExaminations,
  updateExamination,
  deleteExamination
};