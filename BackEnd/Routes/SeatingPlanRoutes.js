const express = require("express");
const router = express.Router();
const {
  getAllSeatingPlans,DeleteSeatingPlansByID
} = require("../Controllers/SeatingPlanController");

const{getSeatingByRollNumber} = require('../Controllers/AllocationController')

const{exportSeatingPlanPDF}=require('../Controllers/PdfController')
const { authenticateJWT, authorizeRoles } = require("../Middleware/Authmiddleware");

router.get("/getall", getAllSeatingPlans);
router.delete("/delete/:id", authenticateJWT , authorizeRoles("ADMIN"),DeleteSeatingPlansByID)
router.get(
  "/exportpdf/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  exportSeatingPlanPDF
);

router.get(
  "/:examId/roll/:rollNumber",
  authenticateJWT,
   getSeatingByRollNumber
);


module.exports = router;
