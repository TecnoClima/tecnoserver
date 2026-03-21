const { Router } = require("express");
const {
  createTechTask,
  getTechTasks,
  getTechTaskById,
  updateTechTask,
  deleteTechTask,
} = require("../controllers/techTaskController");

const router = Router();

router.post("/", createTechTask);
router.get("/", getTechTasks);
router.get("/:id", getTechTaskById);
router.put("/:id", updateTechTask);
router.delete("/:id", deleteTechTask);

module.exports = router;
