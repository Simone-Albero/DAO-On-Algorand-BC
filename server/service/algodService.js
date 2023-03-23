var fs = require('fs');
path = require('path');

// algod connection parameters
const algosdk = require('algosdk');
const algodToken = 'wyJPvEjtIB9r5G1fbvR6w7TlUQsJtDZjrPVhAa0a';
const algodServer = 'https://testnet-algorand.api.purestake.io/ps2';
const algodPort = '';
algodClient = new algosdk.Algodv2({'X-API-Key': algodToken}, algodServer, algodPort);


const getBalance = async (walletAddr) => {
    const accountInfo = await algodClient.accountInformation(String(walletAddr)).do();
    return accountInfo.amount / 1000000;
}

const getAssetIdByWalletAddr = async (walletAddr) => {
    const accountInfo = await algodClient.accountInformation(String(walletAddr)).do();
   
    let assets = accountInfo.assets;
    let assetId = [];

    for(i = 0; i < assets.length; i++){
        assetId.push(Object.values(assets[i])[1]);
    }

    console.log(assetId);
    return assetId;
}

const hasAssetInWallet = async (walletAddr, assetId) => {
    const accountInfo = await algodClient.accountInformation(String(walletAddr)).do();
    let assets = accountInfo.assets;
    
    for(i = 0; i < assets.length; i++){
        if (Object.values(assets[i])[1] == assetId) {
            return true;
        }
    }

    return false

}


const deploy = async (signedTxn) => {
    // Submit the transaction
    txn = await algodClient.sendRawTransaction(signedTxn).do();
    
    // Wait for transaction to be confirmed
    confirmedTxn = await algosdk.waitForConfirmation(algodClient, txn.txId, 4);
    
    let transactionResponse = await algodClient.pendingTransactionInformation(txn.txId).do();
    let appId = transactionResponse['application-index'];
    return {appId, txId: txn.txId};
}

const compile = async (fName) => {
    // preparing program source to compile 
    filePath = path.join(__dirname, fName);
    let programSource = fs.readFileSync(filePath);
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);

    // compiling program source
    let compileResponse = await algodClient.compile(programBytes).do();
    let compiledBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));
    return compiledBytes;
}

const makeUnsignedTxn = async (sender, approvalPath, clearPath, app_args, localInts, localBytes, globalInts, globalBytes, foreignAccounts, foreignApps, foreignAssets) => {
    // declare approval and clear program
    let approvalProgram = await compile(approvalPath); 
    let clearProgram = await compile(clearPath);

    // get node suggested parameters
    let params = await algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    // declare onComplete as NoOp
    onComplete = algosdk.OnApplicationComplete.NoOpOC;    

    // create unsigned transaction
    let txn = algosdk.makeApplicationCreateTxn(sender, params, onComplete, 
        approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, app_args, foreignAccounts, foreignApps, foreignAssets);
    
    return txn;
}

const makeUnsignedNoOpTxn = async (sender, index, appArgs, foreignAccounts, foreignApps, foreignAssets) => {
    // get node suggested parameters
    let params = await algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;

    // create unsigned transaction
    let txn = algosdk.makeApplicationNoOpTxn(sender, params, index, appArgs, foreignAccounts, foreignApps, foreignAssets);
    return txn;
}

const makeAtomicTxnGroup = (txns) => {
    algosdk.assignGroupID(txns);
}

const makeOptIn = async (sender, app_id, foreignAccounts, foreignApps, foreignAssets) => {
    // get node suggested parameters
    let params = await algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    let txn = algosdk.makeApplicationOptInTxn(sender, params, app_id, undefined, foreignAccounts, foreignApps, foreignAssets);
    return txn;
}


module.exports = {
    getBalance,
    getAssetIdByWalletAddr,
    hasAssetInWallet,
    deploy,
    compile,
    makeUnsignedTxn,
    makeUnsignedNoOpTxn,
    makeAtomicTxnGroup,
    makeOptIn
}