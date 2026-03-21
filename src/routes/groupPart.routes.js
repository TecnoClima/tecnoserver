const { Router } = require("express");
const {
  createGroupPart,
  getGroupParts,
  getGroupPartById,
  updateGroupPart,
  deleteGroupPart,
} = require("../controllers/groupPartController");

const router = Router();

router.post("/", createGroupPart);
router.get("/", getGroupParts);
router.get("/:id", getGroupPartById);
router.put("/:id", updateGroupPart);
router.delete("/:id", deleteGroupPart);

module.exports = router;
