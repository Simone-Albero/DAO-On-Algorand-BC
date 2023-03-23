const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proposalSchema = new Schema({
    creator: {
        type: String,
        required: true
    },
    appId: {
        type: Number,
        required: true
    },
    daoAppId: {
        type: Number,
        required: true
    },
    description: {
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
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    yesVotes: {
        type: Number,
        required: true
    },
    noVotes: {
        type: Number,
        required: true
    },
}, {timestamps: true});

const Proposal = mongoose.model("Proposal", proposalSchema);
module.exports = Proposal;