const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/balance/:walletAddr", userController.getBalance);
router.get("/asset/check/:walletAddr/:assetId", userController.hasAssetInWallet);
router.get("/asset/:walletAddr", userController.getAssetIdByWalletAddr);


module.exports = router;