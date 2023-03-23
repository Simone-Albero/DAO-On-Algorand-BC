const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daoSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    appId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    urlHash: {
        type: String,
        required: true
    },
    isProposalPublic: {
        type: Boolean,
        required: true
    },
    tokenAddr: {
        type: Number,
        required: true
    },
    isAssociation: {
        type: Boolean,
        required: true
    },
}, {timestamps: true});

const Dao = mongoose.model("Dao", daoSchema);
module.exports = Dao;