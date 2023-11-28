const express = require("express");
const layananController = require("../controllers/layanan.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, layananController.save);
router.get("/", layananController.index);
// router.get("/:id", layananController.show);
router.patch("/:id", checkAuthMiddleware.checkAuth, layananController.update);
router.delete("/:id", checkAuthMiddleware.checkAuth, layananController.destroy);

module.exports = router;
