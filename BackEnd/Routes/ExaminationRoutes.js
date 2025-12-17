const express = require("express");
const router = express.Router();

// Controllers
const {
  createExamination,
  getAllExaminations,
  updateExamination,
  deleteExamination,
} = require("../Controllers/ExaminationController");

const {
  allocateSeating,
  getSeatingPlanByExam,
} = require("../Controllers/AllocationController");

const {
  exportSeatingPlanPDF,
} = require("../Controllers/PdfController");

// Middleware
const {
  authenticateJWT,
  authorizeRoles,
} = require("../Middleware/Authmiddleware");

// -------------------- Examination CRUD --------------------

// Only admin can create exams
router.post(
  "/create",
  authenticateJWT,
  authorizeRoles("admin"),
  createExamination
);

// Admin, student, and examiner can view all exams
router.get(
  "/getall",
  authenticateJWT,
  authorizeRoles("admin", "student", "examiner"),
  getAllExaminations
);

// Only admin can update exams
router.put(
  "/update/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  updateExamination
);

// Only admin can delete exams
router.delete(
  "/delete/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  deleteExamination
);

// -------------------- Seating Allocation --------------------

// Only admin can allocate seating
router.post(
  "/allocate/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  allocateSeating
);

// Admin, student, and examiner can view seating plans
router.get(
  "/seatingplan/:id",
  authenticateJWT,
  authorizeRoles("admin", "student", "examiner"),
  getSeatingPlanByExam
);

// -------------------- Export PDF --------------------

// Admin and examiner can export PDFs
router.get(
  "/exportpdf/:id",
  authenticateJWT,
  authorizeRoles("admin", "examiner"),
  exportSeatingPlanPDF
);

module.exports = router;
