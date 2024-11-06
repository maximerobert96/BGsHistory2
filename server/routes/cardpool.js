const express = require("express");
const dbManager = require('../db/dbManager');
const optimizerFunctions = require("../db/optimization/optimizationFilesFunctions");

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

cardPoolRoutes.route("/:patchId/putricide-pool").get(function(req,res) {
    
    try {
        let patchId = req.params.patchId;
        // let cards = dbManager.getCardsOfPool(patchId, poolName)
        let cards = optimizerFunctions.getPutricideCards(patchId);
        res.json(cards);
    } catch (error) {
        res.status(404);
        res.json({error: error.message});
        
    }
});

cardPoolRoutes.route("/:patchId/buddy-pool").get(function(req,res) {
    
    try {
        let patchId = req.params.patchId;
        // let cards = dbManager.getCardsOfPool(patchId, poolName)
        let cards = optimizerFunctions.getBuddies(patchId);
        res.json(cards);
    } catch (error) {
        res.status(404);
        res.json({error: error.message});
        
    }
});

module.exports = cardPoolRoutes;