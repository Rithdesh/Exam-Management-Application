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

// Admin, student,  can view all exams
router.get(
  "/getall",
  authenticateJWT,
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

// Admin, student, and  can view seating plans
router.get(
  "/seatingplan/:id",
  authenticateJWT,
  getSeatingPlanByExam
);



// -------------------- Export PDF --------------------

// Admin and  can export PDFs


module.exports = router;
