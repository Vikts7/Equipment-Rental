const express = require("express");
const router = express.Router();

const equipmentController = require("../controllers/equipmentController");
const { authenticate, authorize } = require("../middleware/auth");

const upload = require("../middleware/upload");

router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  equipmentController.createEquipment,
);

router.get("/", equipmentController.getEquipment);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  equipmentController.updateEquipment,
);

router.get("/:id", equipmentController.getEquipmentById);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  equipmentController.deleteEquipment,
);

module.exports = router;
