const express = require("express"); 
const router = express.Router();

const {
  createHall,
  getHalls,
  deleteHall, // <-- add delete controller
  allocateStudentsToHalls,
} = require("../Controllers/HallController");

const { authenticateJWT, authorizeRoles } = require("../Middleware/Authmiddleware");

// Create hall
router.post(
  "/create",
  authenticateJWT,
  authorizeRoles("admin"),
  createHall
);

// Get all halls
router.get(
  "/gethalls",
  authenticateJWT,
  authorizeRoles("admin"),
  getHalls
);

// Delete hall
router.delete(
  "/delete/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  deleteHall
);

// Allocate students based on hall availability
router.post(
  "/allocate",
  authenticateJWT,
  authorizeRoles("admin"),
  allocateStudentsToHalls
);

module.exports = router;
