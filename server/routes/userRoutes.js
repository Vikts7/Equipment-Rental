const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);

// Admin only
router.get("/", authenticate, authorize("admin"), userController.getUsers);

// User updates self OR admin
router.put("/:id", authenticate, userController.updateUser);

// Admin only
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  userController.deleteUser,
);

module.exports = router;
