const { Router } = require("express");
const {
  createOption,
  getOptions,
  getOptionById,
  updateOption,
  deleteOption,
} = require("../controllers/optionsController");

const router = Router();

// GET /options?collection=workOrder&type=clase&active=true&page=1&limit=20
router.get("/", getOptions);
router.get("/:id", getOptionById);
router.post("/", createOption);
router.put("/:id", updateOption);
router.delete("/:id", deleteOption);

module.exports = router;
