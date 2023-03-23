const algodService = require("../service/algodService");
const proposalService = require("../service/proposalService");

const proposalGetAllByCreator = (req, res) => {
    proposalService.findAllByCreator(req.params.creator)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const proposalGetAllByDao = (req, res) => {
    proposalService.findAllByDao(req.params.daoAppId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const proposalGet = (req, res) => {
    proposalService.findById(req.params.id)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => res.status(404).send(err.toString()));
}

const proposalDelete = (req, res) => {
    proposalService.findByIdAndDelete(req.params.id, req.body.walletAddr)
    .then((result) => {
        res.send("deleted");
    })
    .catch((err) => res.status(404).send(err.toString()));
}

const toUnixTimeStamp = (date) => {
    timeStamp = new Date(date).getTime();
    return Math.floor(timeStamp / 1000);
}

function numToUint8Array(num) {
    const arr = new Uint8Array(8);
    
    for(let i = 0; i < 8; i++)
      arr.set([num/0x100**i], 7-i)
  
    return arr;
}

const proposalMakeStart = (req, res) => {
    const proposal = req.body;

    // declaring app args
    var enc = new TextEncoder(); 

    app_args = [enc.encode(proposal.description), enc.encode(proposal.url), enc.encode(proposal.urlHash),
        numToUint8Array(toUnixTimeStamp(proposal.startDate)), numToUint8Array(toUnixTimeStamp(proposal.endDate))];

    algodService.makeUnsignedTxn(proposal.creator, "../../smart_contract/proposal/approval.teal", 
        "../../smart_contract/proposal/clear.teal", app_args, 1, 1, 7, 4, undefined, [proposal.daoAppId], undefined)
        .then((txn1) => {
            app_args = [enc.encode("setLstProposalAddr")];
            algodService.makeUnsignedNoOpTxn(proposal.creator, proposal.daoAppId, app_args)
                .then((txn2) => {
                    algodService.makeAtomicTxnGroup([txn1, txn2]);
                    res.send({txn1: txn1.toByte().join(","), txn2: txn2.toByte().join(","), proposal});
                })
                .catch((err) => res.status(400).send(err.toString()));
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const proposalMakeEnd = (req, res) => {
    const signedTxn1 = Uint8Array.from(req.body.txn1.split(","));
    const signedTxn2 = Uint8Array.from(req.body.txn2.split(","));

    let signed = [];
    signed.push( signedTxn1 );
    signed.push( signedTxn2 );

    algodService.deploy(signed)
        .then((result) => {
            newProposal= req.body.proposal;
            newProposal.appId = result.appId;

            proposalService.create(newProposal)
                .then(res.send(result.txId))
                .catch((err) => console.log(err))
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const proposalCallStart = (req, res) => {
    const appId = req.body.appId;
    const value = req.body.value;
    const sender = req.body.sender;
    const field = req.body.field[0].toUpperCase() + req.body.field.substring(1);

    // declaring app args
    var enc = new TextEncoder();
    if(typeof value === 'string') app_args = [enc.encode("set" + field), enc.encode(value)];
    else app_args = [enc.encode("set" + field), Uint8Array.of(value)];  
    
    algodService.makeUnsignedNoOpTxn(sender, appId, app_args)
        .then((result) => {
            res.send({txn: result.toByte().join(",")});
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const proposalCallEnd = (req, res) => {
    const signedTxn = Uint8Array.from(req.body.txn.split(","));
    algodService.deploy(signedTxn)
        .then((result) => {
            proposalService.registerVoteById(req.body.proposal, req.body.value)
                .then(() => {
                    res.send(result.txId);
                })
                .catch((err) => res.status(404).send(err.toString()));
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const proposalOptInStart = (req, res) => {
    const appId = req.body.appId;
    const sender = req.body.sender;
    const token = req.body.token;
    
    algodService.makeOptIn(sender, appId, undefined, undefined, [token])
        .then((result) => {
            res.send({txn: result.toByte().join(",")});
        })
        .catch((err) => res.status(400).send(err.toString()));
}

const proposalOptInEnd = (req, res) => {
    const signedTxn = Uint8Array.from(req.body.txn.split(","));
    algodService.deploy(signedTxn)
        .then((result) => {
            res.send(result.txId);
        })
        .catch((err) => res.status(400).send(err.toString()));
}


module.exports = {
    proposalGetAllByCreator,
    proposalGetAllByDao,
    proposalGet,
    proposalDelete,
    proposalMakeStart,
    proposalMakeEnd,
    proposalCallStart,
    proposalCallEnd,
    proposalOptInStart,
    proposalOptInEnd
}