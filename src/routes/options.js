const { Router } = require("express");
const {
  createOption,
  getOptions,
  getOptionById,
  updateOption,
  deleteOption,
} = require("../controllers/optionsController");

const router = Router();

router.post("/", createOption);
router.get("/", getOptions);
router.get("/:id", getOptionById);
router.put("/:id", updateOption);
router.delete("/:id", deleteOption);

module.exports = router;
