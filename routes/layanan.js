const express = require("express");
const layananController = require("../controllers/layanan.controller");
const checkAuthMiddleware = require("../middleware/check-auth");
const justAdminMiddleware = require("../middleware/just-admin");

const router = express.Router();

router.post("/", justAdminMiddleware.justAdmin, layananController.save);
router.get("/", checkAuthMiddleware.checkAuth, layananController.index);
router.get("/:id", checkAuthMiddleware.checkAuth, layananController.show);
router.patch("/:id", justAdminMiddleware.justAdmin, layananController.update);
router.delete("/:id", justAdminMiddleware.justAdmin, layananController.destroy);

module.exports = router;
