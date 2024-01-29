const express = require("express");
const userController = require("../controllers/user.controller");
const checkAuthMiddleware = require("../middleware/check-auth");
const justAdminMiddleware = require("../middleware/just-admin");

const router = express.Router();

router.post("/sign-up", userController.signUp);
router.post("/login", userController.login);
router.get("/", justAdminMiddleware.justAdmin, userController.index);
router.get("/:id", checkAuthMiddleware.checkAuth, userController.show);
router.patch("/:id", checkAuthMiddleware.checkAuth, userController.update);

module.exports = router;
