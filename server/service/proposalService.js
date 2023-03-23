const Proposal = require("../models/proposal");


const findAllByCreator = async (params) => {
    var query = {'creator': params};

    try {
        result = await Proposal.find(query).sort({ createdAt: -1});
        return result;
    } catch (error) {
        throw error
    }
}

const findAllByDao = async (params) => {
    var query = {'daoAppId': params};

    try {
        result = await Proposal.find(query).sort({ createdAt: -1});
        return result;
    } catch (error) {
        throw error
    }
}

const findById = async (id) => {
    try {
        result = await Proposal.findById(id);
        return result;
    } catch (error) {
        throw error;
    }
}

const findByIdAndDelete = async (id, walletAddr) => {
    try {
        proposal = await Proposal.findById(id);
        if (proposal.creator != walletAddr) throw "permission denied";
        result = await Proposal.findByIdAndDelete(id);
        return result;
    } catch (error) {
        throw error;
    }
}

const findByDaoAndDelete = async (appId) => {
    try {
        result = Proposal.deleteMany({'daoAppId': appId})
        return result;
    } catch (error) {
        throw error;
    }
}

const create = async (body) => {
    body.yesVotes = 0;
    body.noVotes = 0;
    body.startDate = new Date(body.startDate);
    body.endDate = new Date(body.endDate);
    proposal = new Proposal(body)

    try {
        result = await proposal.save();
        return;
    } catch (error) {
        throw error;
    }
}

const findByIdAndUpdate = async (body) => {
    proposal = new Proposal(body);
    var query = {'_id': proposal._id};

    try {
        result = await Proposal.findOneAndUpdate(query, proposal);
        return result;
    } catch (error) {
        throw error;
    }
}

const registerVoteById = async (body, vote) => {
    proposal = new Proposal(body);
    var query = {'_id': proposal._id};

    if(vote == 'yes') proposal.yesVotes += 1
    else proposal.noVotes += 1

    try {
        result = await Proposal.findOneAndUpdate(query, proposal);
        return result;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAllByCreator,
    findAllByDao,
    findById,
    findByIdAndDelete,
    findByDaoAndDelete,
    create,
    findByIdAndUpdate,
    registerVoteById
}