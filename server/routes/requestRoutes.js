const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");
const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, requestController.createRequest);

router.get("/my", authenticate, requestController.getMyRequests);

router.get("/", authenticate, requestController.getAllRequests);

router.put("/:id/status", authenticate, requestController.updateStatus);

router.delete("/:id", authenticate, requestController.deleteRequest);

module.exports = router;
