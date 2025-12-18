const PDFDocument = require("pdfkit");
const SeatingPlan = require("../Models/SeatingPlan");

exports.exportSeatingPlanPDF = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Seating plan ID is required" });
    }

    const seatingPlan = await SeatingPlan.findById(id)
      .populate("examination", "examName date")
      .populate("classrooms.hall", "hallName capacity");

    if (!seatingPlan) {
      return res.status(404).json({ message: "Seating plan not found" });
    }

    const exam = seatingPlan.examination;

    /* ---------- RESPONSE HEADERS ---------- */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=SeatingPlan_${exam.examName.replace(/\s+/g, "_")}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    doc.pipe(res);

    /* ---------- HEADER ---------- */
    doc
      .fontSize(14)
      .text("OFFICE OF THE CONTROLLER OF EXAMINATIONS", { align: "center" });
    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .text("Sri Eshwar College of Engineering", { align: "center" });
    doc.moveDown();

    doc
      .fontSize(11)
      .text(
        `${exam.examName} – ${new Date(exam.date).toDateString()}`,
        { align: "center" }
      );

    doc.moveDown(1.5);

    /* ---------- TABLE COLUMN POSITIONS ---------- */
    const col = {
      sno: 40,
      hall: 80,
      subject: 130,
      register: 260,
      count: 430,
    };

    let y = doc.y;

    /* ---------- TABLE HEADER ---------- */
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
       BUILD MERGED ROWS (Hall + Subject)
    ===================================================== */
    const rowsMap = {};
    let totalStudents = 0;

    seatingPlan.classrooms.forEach((room) => {
      const hallName = room.hall?.hallName || room.hallName || "N/A";

      room.allocations.forEach((alloc) => {
        const key = `${hallName}__${alloc.subjectName}`;

        if (!rowsMap[key]) {
          rowsMap[key] = {
            hall: hallName,
            subject: alloc.subjectName,
            ranges: [],
            count: 0,
          };
        }

        alloc.rollRanges.forEach((range) => {
          const from = Number(range.from);
          const to = Number(range.to);

          if (!isNaN(from) && !isNaN(to)) {
            rowsMap[key].ranges.push(
              from === to ? `${from}` : `${from} - ${to}`
            );
            rowsMap[key].count += to - from + 1;
          }
        });
      });
    });

    /* ---------- TABLE BODY ---------- */
    let sno = 1;

    Object.values(rowsMap).forEach((row) => {
      const registerText = row.ranges.join(", ");

      doc
        .fontSize(10)
        .text(sno.toString(), col.sno, y)
        .text(row.hall, col.hall, y)
        .text(row.subject, col.subject, y)
        .text(registerText, col.register, y, {
          width: 160,
        })
        .text(row.count.toString(), col.count, y, {
          width: 50,
          align: "right",
        });

      y += 18;
      sno++;
      totalStudents += row.count;

      /* Page break safety */
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    /* ---------- FOOTER ---------- */
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

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      message: "PDF generation failed",
      error: error.message,
    });
  }
};
