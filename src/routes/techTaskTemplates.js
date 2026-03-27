const { Router } = require("express");
const {
  createTechTaskTemplate,
  getAllTechTaskTemplates,
  getTechTaskTemplateById,
  updateTechTaskTemplate,
  deleteTechTaskTemplate,
} = require("../controllers/techTaskTemplates");

const router = Router();

router.post("/", createTechTaskTemplate);
router.get("/", getAllTechTaskTemplates);
router.get("/:id", getTechTaskTemplateById);
router.put("/:id", updateTechTaskTemplate);
router.delete("/:id", deleteTechTaskTemplate);

module.exports = router;
