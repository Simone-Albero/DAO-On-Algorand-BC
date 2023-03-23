const express = require("express");
const daoController = require("../controllers/daoController");

const router = express.Router();

router.get("/all", daoController.daoGetAll);
router.get("/all/:owner", daoController.daoGetAllByOwner);
router.get("/appId/:appId", daoController.daoGetAllByAppId);
router.post("/make/start", daoController.daoMakeStart);
router.post("/make/end", daoController.daoMakeEnd);
router.get("/get/:id", daoController.daoGet);
router.delete("/:id", daoController.daoDelete);
router.post("/update/start", daoController.daoUpdateStart);
router.post("/update/end", daoController.daoUpdateEnd);

module.exports = router;