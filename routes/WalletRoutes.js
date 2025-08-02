const router = require("express").Router();
const { createWallet, getAllWallets, updateWallet, deleteWallet, getWalletById } = require("../controllers/WalletControllers");
const AuthService = require("../utils/AuthService");


router.route("/")
.post(AuthService.protect,createWallet)
.get(AuthService.protect , getAllWallets)

router.route("/:id")
.get(AuthService.protect , getWalletById)
.put(AuthService.protect,updateWallet)
.delete(AuthService.protect , deleteWallet)

module.exports = router;