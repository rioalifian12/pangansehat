const express = require("express");
const transaksiController = require("../controllers/transaksi.controller");
const checkAuthMiddleware = require("../middleware/check-auth");
const justUserMiddleware = require("../middleware/just-user");
const justAdminMiddleware = require("../middleware/just-admin");
const transaksiSnapController = require("../controllers/transaksi_snap.controller");

const router = express.Router();

router.post(
  "/snap",
  justUserMiddleware.justUser,
  transaksiSnapController.transaksi_snap
);
router.get("/", checkAuthMiddleware.checkAuth, transaksiController.index);
router.get("/:id", checkAuthMiddleware.checkAuth, transaksiController.show);
router.post("/:orderId", transaksiController.notif);
router.patch("/:id", justAdminMiddleware.justAdmin, transaksiController.update);

module.exports = router;
