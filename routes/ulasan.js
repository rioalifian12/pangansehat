const express = require("express");
const ulasanController = require("../controllers/ulasan.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, ulasanController.save);
router.get("/", ulasanController.index);
// router.get("/:id", ulasanController.show);
router.patch("/:id", checkAuthMiddleware.checkAuth, ulasanController.update);
// router.delete("/:id", checkAuthMiddleware.checkAuth, ulasanController.destroy);

module.exports = router;
