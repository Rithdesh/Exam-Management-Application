const PDFDocument = require("pdfkit");
const SeatingPlan = require("../Models/SeatingPlan");

/* =====================================================
   HARD SANITIZER (ASCII-ONLY, HEADER SAFE)
===================================================== */
const sanitizeFileName = (name = "SeatingPlan") => {
  return name
    .normalize("NFKD")                 // remove unicode
    .replace(/[^\x00-\x7F]/g, "")      // strip non-ASCII
    .replace(/[^a-zA-Z0-9._-]/g, "_")  // safe chars only
    .replace(/_+/g, "_")
    .trim();
};

exports.exportSeatingPlanPDF = async (req, res) => {
  try {
    const { id } = req.params;

    /* ---------- BASIC VALIDATION ---------- */
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Seating plan ID is required",
      });
    }

    /* ---------- FETCH DATA ---------- */
    const seatingPlan = await SeatingPlan.findById(id)
      .populate("examination", "examName date")
      .populate("classrooms.hall", "hallName capacity");

    if (!seatingPlan) {
      return res.status(404).json({
        success: false,
        message: "Seating plan not found",
      });
    }

    if (!seatingPlan.examination) {
      return res.status(400).json({
        success: false,
        message: "Examination not linked with this seating plan",
      });
    }

    const exam = seatingPlan.examination;
   const rawName = sanitizeFileName(exam.examName);

// fallback if name becomes empty after sanitization
const finalName =
  rawName && rawName.length > 0
    ? `SeatingPlan_${rawName}.pdf`
    : `SeatingPlan.pdf`;

res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename=${finalName}`
);
res.setHeader(
  "Access-Control-Expose-Headers",
  "Content-Disposition"
);


    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(res);

    /* =====================================================
       PDF HEADER
    ===================================================== */
    doc
      .fontSize(14)
      .text("OFFICE OF THE CONTROLLER OF EXAMINATIONS", {
        align: "center",
      });
    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .text("Sri Eshwar College of Engineering", {
        align: "center",
      });
    doc.moveDown();

    doc
      .fontSize(11)
      .text(
        `${exam.examName} - ${new Date(exam.date).toDateString()}`,
        { align: "center" }
      );

    doc.moveDown(1.5);

    /* =====================================================
       TABLE LAYOUT
    ===================================================== */
    const col = {
      sno: 40,
      hall: 80,
      subject: 130,
      register: 260,
      count: 430,
    };

    let y = doc.y;

    doc
      .fontSize(10)
      .text("S.No", col.sno, y)
      .text("Hall", col.hall, y)
      .text("Subject", col.subject, y)
      .text("Register Numbers", col.register, y)
      .text("Count", col.count, y, { width: 50, align: "right" });

    y += 15;
    doc.moveTo(40, y).lineTo(550, y).stroke();
    y += 8;

    /* =====================================================
       BUILD ROWS (MERGED RANGES + INDIVIDUAL ROLLS)
    ===================================================== */
    const rowsMap = {};
    let totalStudents = 0;

    Array.isArray(seatingPlan.classrooms) &&
      seatingPlan.classrooms.forEach((room) => {
        const hallName = room.hall?.hallName || "N/A";

        Array.isArray(room.allocations) &&
          room.allocations.forEach((alloc) => {
            const subject = alloc.subjectName || "UNKNOWN";
            const key = `${hallName}__${subject}`;

            if (!rowsMap[key]) {
              rowsMap[key] = {
                hall: hallName,
                subject,
                registers: [],
                count: 0,
              };
            }

            /* ---- Roll ranges ---- */
            Array.isArray(alloc.rollRanges) &&
              alloc.rollRanges.forEach((r) => {
                const from = Number(r?.from);
                const to = Number(r?.to);

                if (!isNaN(from) && !isNaN(to)) {
                  rowsMap[key].registers.push(
                    from === to ? `${from}` : `${from} - ${to}`
                  );
                  rowsMap[key].count += to - from + 1;
                }
              });

            /* ---- Individual rolls ---- */
            Array.isArray(alloc.individualRolls) &&
              alloc.individualRolls.forEach((roll) => {
                const num = Number(roll);
                if (!isNaN(num)) {
                  rowsMap[key].registers.push(`${num}`);
                  rowsMap[key].count += 1;
                }
              });
          });
      });

    /* =====================================================
       TABLE BODY
    ===================================================== */
    let sno = 1;

    Object.values(rowsMap).forEach((row) => {
      doc
        .fontSize(10)
        .text(String(sno), col.sno, y)
        .text(row.hall, col.hall, y)
        .text(row.subject, col.subject, y)
        .text(row.registers.join(", "), col.register, y, {
          width: 160,
        })
        .text(String(row.count), col.count, y, {
          width: 50,
          align: "right",
        });

      totalStudents += row.count;
      y += 18;
      sno++;

      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    /* =====================================================
       FOOTER
    ===================================================== */
    y += 5;
    doc.moveTo(40, y).lineTo(550, y).stroke();
    y += 10;

    doc
      .fontSize(11)
      .text(`Total Students: ${totalStudents}`, col.count - 80, y, {
        align: "right",
      });

    doc.moveDown(2);
    doc.text("CONTROLLER OF EXAMINATIONS", { align: "right" });

    doc.end();

    /* ---------- DEBUG (SAFE) ---------- */
    console.log("PDF GENERATED:", {
      seatingPlanId: id,
      rows: Object.keys(rowsMap).length,
      totalStudents,
    });

  } catch (error) {
    console.error("PDF generation error:", error);

    res.status(500).json({
      success: false,
      message: "PDF generation failed",
      error: error.message,
    });
  }
};
