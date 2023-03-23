const express = require("express");
const proposalController = require("../controllers/proposalController");

const router = express.Router();

router.get("/all/dao/:daoAppId", proposalController.proposalGetAllByDao);
router.get("/all/:creator", proposalController.proposalGetAllByCreator);
router.post("/make/start", proposalController.proposalMakeStart);
router.post("/make/end", proposalController.proposalMakeEnd);
router.post("/call/start", proposalController.proposalCallStart);
router.post("/call/end", proposalController.proposalCallEnd);
router.post("/optIn/start", proposalController.proposalOptInStart);
router.post("/optIn/end", proposalController.proposalOptInEnd);
router.get("/:id", proposalController.proposalGet);
router.delete("/:id", proposalController.proposalDelete);

module.exports = router;