const { Router } = require("express");
const {
  createTaskTemplate,
  getTaskTemplates,
  getTaskTemplateById,
  updateTaskTemplate,
  deleteTaskTemplate,
} = require("../controllers/taskTemplateController");

const router = Router();

router.post("/", createTaskTemplate);
router.get("/", getTaskTemplates);
router.get("/:id", getTaskTemplateById);
router.put("/:id", updateTaskTemplate);
router.delete("/:id", deleteTaskTemplate);

module.exports = router;
