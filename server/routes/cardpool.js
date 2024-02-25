const express = require("express");
const dbManager = require('../db/dbManager');

const cardPoolRoutes = express.Router();

cardPoolRoutes.route("/:patchId/card-pool/:poolName").get(function(req,res) {
    
    try {
        let patchId = req.params.patchId;
        let poolName = req.params.poolName;
        let cards = dbManager.getCardsOfPool(patchId, poolName)
        res.json(cards);
    } catch (error) {
        res.status(404);
        res.json({error: error.message});
        
    }
});

module.exports = cardPoolRoutes;