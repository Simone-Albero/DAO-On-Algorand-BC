const algodService = require("../service/algodService");


const getBalance = (req, res) => {    
    algodService.getBalance(req.params.walletAddr)
    .then((result) => {
        res.send(String(result))
    })
    .catch((err) => res.status(400).send(err.toString()));
}

const getAssetIdByWalletAddr = (req, res) => {    
    algodService.getAssetIdByWalletAddr(req.params.walletAddr)
    .then((result) => {
        res.send(String(result))
    })
    .catch((err) => res.status(400).send(err.toString()));
}

const hasAssetInWallet = (req, res) => {    
    algodService.hasAssetInWallet(req.params.walletAddr, req.params.assetId)
    .then((result) => {
        res.send(result)
    })
    .catch((err) => res.status(404).send(err.toString()));
}

module.exports = {
    getBalance,
    getAssetIdByWalletAddr,
    hasAssetInWallet
}