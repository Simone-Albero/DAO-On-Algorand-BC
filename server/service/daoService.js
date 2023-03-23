const Dao = require("../models/dao");

const getAll = async () => {
    try {
        result = await Dao.find().sort({ createdAt: -1});
        return result;
    } catch (error) {
        throw error
    }
}

const findAllByOwner = async (params) => {
    var query = {'owner': params};

    try {
        result = await Dao.find(query).sort({ createdAt: -1});
        return result;
    } catch (error) {
        throw error
    }
}

const findAllByAppId = async (params) => {
    var query = {'appId': params};

    try {
        result = await Dao.find(query).sort({ createdAt: -1});
        return result;
    } catch (error) {
        throw error
    }
}

const findById = async (id) => {
    try {
        result = await Dao.findById(id);
        return result;
    } catch (error) {
        throw error;
    }
}

const findByIdAndDelete = async (id, walletAddr) => {
    try {
        dao = await Dao.findById(id);
        if (dao.owner != walletAddr) throw "permission denied";
        result = await Dao.findByIdAndDelete(id);
        return result;
    } catch (error) {
        throw error;
    }
}

const create = async (body) => {
    dao = new Dao(body)

    try {
        result = await dao.save();
        return;
    } catch (error) {
        throw error;
    }
}

const findByIdAndUpdate = async (body) => {
    dao = new Dao(body);
    var query = {'_id': dao._id};

    try {
        result = await Dao.findOneAndUpdate(query, dao);
        return result;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    getAll,
    findAllByOwner,
    findAllByAppId,
    findById,
    findByIdAndDelete,
    create,
    findByIdAndUpdate
}