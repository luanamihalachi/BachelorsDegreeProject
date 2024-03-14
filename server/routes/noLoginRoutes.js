const express = require("express");

const qrCodeController = require("../controllers/qrCode");

const router = express.Router();

router.post("/scanQrCode", qrCodeController.postScanQRCode);

module.exports = router;
