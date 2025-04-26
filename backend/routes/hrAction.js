const express = require("express");
const router = express.Router();
const {
  promoteEmployee,
  getPromotionsByEmployee,
  transferEmployee,
  getTransfersByEmployee,
  terminateEmployee,
  getTerminationDetails,
  getPromotedEmployees,
} = require("../controllers/hrAction");
const { verifyToken, isAdmin } = require("../middlewares/generateToken");

// 📌 PROMOTION
router.post("/promotions/:employeeId", promoteEmployee);
router.get("/getpromoted/:employeeId", verifyToken, isAdmin, getPromotionsByEmployee);
router.get("/promoted-employees", verifyToken, isAdmin, getPromotedEmployees);

// 📌 TRANSFER
router.post("/transfers/:employeeId", transferEmployee);
router.get("/transfers/:employeeId", getTransfersByEmployee);

// 📌 TERMINATION
router.post("/terminations/:employeeId", terminateEmployee);
router.get("/terminations/:employeeId", getTerminationDetails);

module.exports = router;
