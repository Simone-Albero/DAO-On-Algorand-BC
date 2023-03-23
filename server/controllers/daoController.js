const algodService = require("../service/algodService");
const daoService = require("../service/daoService");
const proposalService = require("../service/proposalService");

const daoGetAll = (req, res) => {    
    daoService.getAll()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const daoGetAllByOwner = (req, res) => {    
    daoService.findAllByOwner(req.params.owner)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const daoGetAllByAppId = (req, res) => {
    daoService.findAllByAppId(req.params.appId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const daoGet = (req, res) => {
    daoService.findById(req.params.id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const daoDelete = (req, res) => {

    daoService.findByIdAndDelete(req.params.id, req.body.walletAddr)
    .then((result) => {
        proposalService.findByDaoAndDelete(result.appId)
        .then(() => {res.send("deleted");})
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(404).send(err.toString()));
}

const daoMakeStart = (req, res) => {
    const dao = req.body;

    // declaring app args
    var enc = new TextEncoder();

    app_args = [enc.encode(dao.name), enc.encode(dao.url), enc.encode(dao.urlHash),
        Uint8Array.of(+ dao.isProposalPublic), Uint8Array.of(dao.tokenAddr), Uint8Array.of(+ dao.isAssociation)];

    algodService.makeUnsignedTxn(dao.owner, "../../smart_contract/dao/approval.teal", 
        "../../smart_contract/dao/clear.teal", app_args, 0, 0, 4, 4)
        .then((result) => {
            res.send({txn: result.toByte().join(","), dao});
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const daoMakeEnd = (req, res) => {
    const signedTxn = Uint8Array.from(req.body.txn.split(","));
    algodService.deploy(signedTxn)
        .then((result) => {
            newDao = req.body.dao;
            newDao.appId = result.appId;

            daoService.create(newDao)
                .then(res.send(result.txId))
                .catch((err) => console.log(err))
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const daoUpdateStart = (req, res) => {
    const dao = req.body.dao;
    const field = req.body.field[0].toUpperCase() + req.body.field.substring(1);

    // declaring app args
    var enc = new TextEncoder();
    if(typeof dao[req.body.field] === 'string') app_args = [enc.encode("set" + field), enc.encode(dao[req.body.field])];
    else app_args = [enc.encode("set" + field), Uint8Array.of(dao[req.body.field])];
    
    algodService.makeUnsignedNoOpTxn(dao.owner, dao.appId, app_args)
        .then((result) => {
            res.send({txn: result.toByte().join(","), dao});
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const daoUpdateEnd = (req, res) => {
    const signedTxn = Uint8Array.from(req.body.txn.split(","));
    algodService.deploy(signedTxn)
        .then((result) => {
            daoService.findByIdAndUpdate(req.body.dao)
                .then(res.send(result.txId))
                .catch((err) => console.log(err))
        })
        .catch((err) => res.status(400).send(err.toString()));
}


module.exports = {
    daoGetAll,
    daoGetAllByOwner,
    daoGetAllByAppId,
    daoGet,
    daoDelete,
    daoMakeStart,
    daoMakeEnd,
    daoUpdateStart,
    daoUpdateEnd,
}