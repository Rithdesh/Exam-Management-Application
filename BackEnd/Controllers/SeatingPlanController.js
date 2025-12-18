
const SeatingPlan = require("../Models/SeatingPlan");

exports.getAllSeatingPlans = async (req, res) => {
  try {
    const seatingPlans = await SeatingPlan.find()
      .populate("examination", "examName date durationMinutes")
      .populate("classrooms.hall", "hallName capacity")
      .sort({ createdAt: -1 })
      .lean(); // performance + cleaner JSON

    return res.status(200).json({
      success: true,
      count: seatingPlans.length,
      seatingPlans,
    });
  } catch (error) {
    console.error("Error fetching seating plans:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch seating plans",
      error: error.message,
    });
  }
};

exports.DeleteSeatingPlansByID=async(req, res) =>{
  try {
    const delPlan = await SeatingPlan.findByIdAndDelete(req.params.id)

    
    if (!delPlan) {
      return res.status(404).json({ message: "Seating Plan not found" });
    }

    res.status(200).json("Seating Plan Deleted Successfully")
  } catch (error) {
    res.status(400).json({
      message:"failed to delete Seating plan",
      error: error.message
    })
  }

}