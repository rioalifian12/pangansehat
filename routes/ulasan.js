const express = require("express");
const ulasanController = require("../controllers/ulasan.controller");
const checkAuthMiddleware = require("../middleware/check-auth");
const justUserMiddleware = require("../middleware/just-user");

const router = express.Router();

router.post("/", justUserMiddleware.justUser, ulasanController.save);
router.get("/", checkAuthMiddleware.checkAuth, ulasanController.index);
router.get("/:id", checkAuthMiddleware.checkAuth, ulasanController.show);
router.patch(
  "/:id",
  justUserMiddleware.justUser,
  checkAuthMiddleware.checkAuth,
  ulasanController.update
);

module.exports = router;
