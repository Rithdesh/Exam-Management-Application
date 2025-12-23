const Examination = require("../Models/Examination");
const Hall = require("../Models/Hall");
const SeatingPlan = require("../Models/SeatingPlan");

/* -------------------------------------------------------
   Expand roll ranges + individual rolls → sorted list
------------------------------------------------------- */

function normalizeRolls({ rollRanges = [], individualRolls = [] }) {
  const rolls = [];

  for (const r of rollRanges) {
    for (let i = r.from; i <= r.to; i++) {
      rolls.push(i);
    }
  }

  for (const roll of individualRolls) {
    rolls.push(roll);
  }

  return [...new Set(rolls)].sort((a, b) => a - b);
}

/* -------------------------------------------------------
   Convert roll list → compact ranges
------------------------------------------------------- */
function rollsToRanges(rolls) {
  if (!rolls.length) return [];

  const ranges = [];
  let start = rolls[0];
  let prev = rolls[0];

  for (let i = 1; i < rolls.length; i++) {
    if (rolls[i] === prev + 1) {
      prev = rolls[i];
    } else {
      ranges.push({ from: start, to: prev, count: prev - start + 1 });
      start = rolls[i];
      prev = rolls[i];
    }
  }

  ranges.push({ from: start, to: prev, count: prev - start + 1 });
  return ranges;
}

/* -------------------------------------------------------
   CREATE SEATING ALLOCATION (DUPLICATE SAFE)
------------------------------------------------------- */
exports.allocateSeating = async (req, res) => {
  try {
    const { id: examId } = req.params;

    /* ---------- Fetch examination ---------- */
    const exam = await Examination.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Examination not found" });
    }

    /* ---------- DUPLICATE ALLOCATION CHECK ---------- */
    const existingPlan = await SeatingPlan.findOne({ examination: examId });
    if (existingPlan) {
      return res.status(409).json({
        message: "Seating allocation already exists for this examination",
        seatingPlanId: existingPlan._id
      });
    }

    /* ---------- Fetch halls ---------- */
    const halls = await Hall.find().sort({ capacity: -1 });
    if (!halls.length) {
      return res.status(400).json({ message: "No halls available" });
    }

    /* ---------- Prepare subjects ---------- */
    const subjects = exam.subjects.map(s => {
      const rolls = normalizeRolls(s);
      return {
        subjectName: s.subjectName,
        queue: rolls,
        remaining: rolls.length
      };
    });

    /* ---------- Total students ---------- */
    const totalStudents = subjects.reduce(
      (sum, s) => sum + s.remaining,
      0
    );

    const classrooms = [];
    let hasOverflow = false;
    const overflowDetails = [];

    /* ===================================================
       CASE 1: SINGLE SUBJECT
    =================================================== */
    if (subjects.length === 1) {
      const subject = subjects[0];

      for (const hall of halls) {
        if (subject.remaining <= 0) break;

        const take = Math.min(hall.capacity, subject.remaining);
        const rolls = subject.queue.splice(0, take);
        subject.remaining -= rolls.length;

        classrooms.push({
          hall: hall._id,
          capacityAtAllocation: hall.capacity,
          studentsInHall: rolls.length,
          notFull: rolls.length < hall.capacity,
          allocations: [{
            subjectName: subject.subjectName,
            count: rolls.length,
            rollRanges: rollsToRanges(rolls)
          }]
        });
      }

    /* ===================================================
       CASE 2: MULTI-SUBJECT MIX
    =================================================== */
    } else {
      for (const hall of halls) {
        const active = subjects.filter(s => s.remaining > 0);
        if (active.length < 2) break;

        const mixCount = active.length >= 3 ? 3 : 2;
        const selected = active.slice(0, mixCount);

        const base = Math.floor(hall.capacity / mixCount);
        let seatsLeft = hall.capacity;
        const alloc = [];

        for (const subj of selected) {
          const take = Math.min(base, subj.remaining);
          const rolls = subj.queue.splice(0, take);

          subj.remaining -= rolls.length;
          seatsLeft -= rolls.length;

          alloc.push({ subjectName: subj.subjectName, rolls });
        }

        while (seatsLeft > 0) {
          const candidate = selected
            .filter(s => s.remaining > 0)
            .sort((a, b) => b.remaining - a.remaining)[0];

          if (!candidate) break;

          alloc.find(a => a.subjectName === candidate.subjectName)
            .rolls.push(candidate.queue.shift());

          candidate.remaining--;
          seatsLeft--;
        }

        const studentsInHall = alloc.reduce(
          (sum, a) => sum + a.rolls.length,
          0
        );

        classrooms.push({
          hall: hall._id,
          capacityAtAllocation: hall.capacity,
          studentsInHall,
          notFull: studentsInHall < hall.capacity,
          allocations: alloc.map(a => ({
            subjectName: a.subjectName,
            count: a.rolls.length,
            rollRanges: rollsToRanges(a.rolls)
          }))
        });
      }
    }

    /* ---------- Overflow handling ---------- */
    subjects.forEach(s => {
      if (s.remaining > 0) {
        hasOverflow = true;
        overflowDetails.push(
          `${s.remaining} students unallocated for ${s.subjectName}`
        );
      }
    });

    /* ---------- Save seating plan ---------- */
    const seatingPlan = await SeatingPlan.create({
      examination: examId,
      classrooms,
      totalStudents,
      hasOverflow,
      overflowDetails
    });

    res.status(201).json({
      message: "Seating allocation completed successfully",
      seatingPlan
    });

  } catch (error) {
    console.error("Allocation error:", error);
    res.status(500).json({
      message: "Allocation fail",
      error: error.message
    });
  }
};

/* -------------------------------------------------------
   FETCH SEATING PLAN BY EXAM
------------------------------------------------------- */
exports.getSeatingPlanByExam = async (req, res) => {
  try {
    const { id } = req.params;

   const seatingPlan = await SeatingPlan
  .findOne({ examination: examId })
  .populate("classrooms.hall", "hallName capacity");


    if (!seatingPlan) {
      return res.status(404).json({ message: "No seating plan found" });
    }

    res.status(200).json({
      message: "Seating plan fetched successfully",
      seatingPlan
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch seating plan",
      error: error.message
    });
  }
};

exports.getSeatingByRollNumber = async (req, res) => {
  try {
    console.log("🔥 HIT getSeatingByRollNumber");
    console.log("➡️ req.params:", req.params);

    const { examId, rollNumber } = req.params;
    const roll = Number(rollNumber);

    if (isNaN(roll)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roll number",
      });
    }

    /* ---------- FIND SEATING PLAN BY EXAM ID ---------- */
    const seatingPlan = await SeatingPlan
      .findOne({ examination: examId })
      .sort({ createdAt: -1 })
      .populate("classrooms.hall", "hallName capacity");

    console.log("🪑 seatingPlan found:", !!seatingPlan);

    if (!seatingPlan) {
      return res.status(404).json({
        success: false,
        message: "Seating plan not generated yet for this examination",
      });
    }

    /* ---------- Traverse classrooms → allocations → rollRanges ---------- */
    for (const classroom of seatingPlan.classrooms) {
      for (const allocation of classroom.allocations) {
        for (const range of allocation.rollRanges) {
          const from = Number(range.from);
          const to = Number(range.to);

          console.log({ roll, from, to });

          if (roll >= from && roll <= to) {
            return res.status(200).json({
              success: true,
              message: "Student seating found",
              seatingDetails: {
                rollNumber: roll,
                subject: allocation.subjectName,
                hall: classroom.hallName,               // snapshot value
                hallCapacity: classroom.capacityAtAllocation,
                rollRange: { from, to },
                examId: seatingPlan.examination,
              },
            });
          }
        }
      }
    }

    return res.status(404).json({
      success: false,
      message: "No seating allocation found for the given roll number",
    });

  } catch (error) {
    console.error("💥 Roll lookup error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch seating details",
      error: error.message,
    });
  }
};




