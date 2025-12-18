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

    /* ---------- TABLE BODY ---------- */
    let sno = 1;
    let totalStudents = 0;

    seatingPlan.classrooms.forEach((room) => {
      const hallName = room.hall?.hallName || "N/A";

      room.allocations.forEach((alloc) => {
        /* Roll ranges */
        alloc.rollRanges.forEach((range) => {
          const count =
            range.to >= range.from ? range.to - range.from + 1 : 1;

          const rangeText =
            range.from === range.to
              ? `${range.from}`
              : `${range.from} - ${range.to}`;

          doc
            .fontSize(10)
            .text(sno.toString(), col.sno, y)
            .text(hallName, col.hall, y)
            .text(alloc.subjectName, col.subject, y)
            .text(rangeText, col.register, y)
            .text(count.toString(), col.count, y, {
              width: 50,
              align: "right",
            });

          y += 15;
          sno++;
          totalStudents += count;
        });

        /* Individual rolls */
        if (Array.isArray(alloc.individualRolls)) {
          alloc.individualRolls.forEach((roll) => {
            doc
              .fontSize(10)
              .text(sno.toString(), col.sno, y)
              .text(hallName, col.hall, y)
              .text(alloc.subjectName, col.subject, y)
              .text(roll.toString(), col.register, y)
              .text("1", col.count, y, {
                width: 50,
                align: "right",
              });

            y += 15;
            sno++;
            totalStudents += 1;
          });
        }
      });
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
