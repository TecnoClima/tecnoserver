const { Router } = require("express");
const {
  createTechOrder,
  getTechOrders,
  getTechOrderById,
  updateTechOrder,
} = require("../controllers/techOrderController");

const router = Router();

// Specific sub-routes must come before /:id
router.post("/tech", createTechOrder);
router.get("/tech", getTechOrders);
router.get("/tech/:id", getTechOrderById);
router.put("/tech/:id", updateTechOrder);

module.exports = router;
