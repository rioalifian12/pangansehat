const express = require("express");
const userController = require("../controllers/user.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/sign-up", userController.signUp);
router.post("/login", userController.login);
router.get("/", userController.index);
// router.get("/:id", userController.show);
router.patch("/:id", checkAuthMiddleware.checkAuth, userController.update);
// router.delete("/:id", checkAuthMiddleware.checkAuth, userController.destroy);

module.exports = router;
