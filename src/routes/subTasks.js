const { Router } = require("express");
const {
  createSubTask,
  getAllSubTasks,
  getSubTaskById,
  updateSubTask,
  deleteSubTask,
} = require("../controllers/subTaskController");

const router = Router();

router.post("/", createSubTask);
router.get("/", getAllSubTasks);
router.get("/:id", getSubTaskById);
router.put("/:id", updateSubTask);
router.delete("/:id", deleteSubTask);

module.exports = router;
