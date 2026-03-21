const { Router } = require("express");
const {
  createTaskOption,
  getTaskOptions,
  getTaskOptionById,
  updateTaskOption,
  deleteTaskOption,
} = require("../controllers/taskOptionController");

const router = Router();

router.post("/", createTaskOption);
router.get("/", getTaskOptions);
router.get("/:id", getTaskOptionById);
router.put("/:id", updateTaskOption);
router.delete("/:id", deleteTaskOption);

module.exports = router;
