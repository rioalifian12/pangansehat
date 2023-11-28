const express = require("express");
const transaksiController = require("../controllers/transaksi.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, transaksiController.charge);
router.get("/", transaksiController.index);
// router.get("/:id", transaksiController.show);
router.get("/:orderId", transaksiController.notif);
router.patch("/:id", checkAuthMiddleware.checkAuth, transaksiController.update);
// router.delete(
//   "/:id",
//   checkAuthMiddleware.checkAuth,
//   transaksiController.destroy
// );

module.exports = router;
