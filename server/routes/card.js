const express = require("express");
const dbManager = require('../db/dbManager');
const optimizerFunctions = require("../db/optimization/optimizationFilesFunctions");

const cardRoutes = express.Router();

cardRoutes.route("/cards").get(function(req,res) {
    let activeCards = dbManager.getActiveCards();

    res.json(activeCards);
});


cardRoutes.route("/cards/:id").get(function(req, res) {
    try {
        let card = dbManager.getCardById(req.params.id);
        res.json(card);
    } catch (error) {
        res.status(404);
        res.json({error: error.message});
        
    }
});

cardRoutes.route("/:patchId/cards").get(function(req, res) {
    let patchId = req.params.patchId;
    let activeCards = optimizerFunctions.getActiveCardsOfPatch(patchId);
    res.json(activeCards);
});

cardRoutes.route("/:patchId/cards2").get(function(req, res) {
    let patchId = req.params.patchId;
    let activeCards = optimizerFunctions.getActiveCardsOfPatch(patchId);
    res.json(activeCards);
});

cardRoutes.route("/:patchId/cards/:id").get(function(req, res) {
    let patchId = req.params.patchId;
    let cardId = req.params.id;
    let card = dbManager.getCardById(cardId, patchId);
    res.json(card);
});

cardRoutes.route("/card-changes/:id").get(function(req, res) {
    try {
        let card = dbManager.getCardChangesOfId(req.params.id);
        res.json(card);
    } catch (error) {
        res.status(404);
        res.json({error: error.message});
        
    }
});


cardRoutes.route("/card-changes/").post(function(req, res){
    // let build = 35747; // first patch
    // let cardId = 736; // old murkeye
    // let affects = "ALL"; //updates all patches. CURRENT, RANGE, ALL are the valid options. RANGE needs field build2
    // let newFields = {"associatedTribes": [ "MURLOC" ]};
    // let modifyGolden = false;
    // let removedFields = []; // array of fields to remove
    // let areNewFieldsReplacingCard = false;
    // let build2;
    // let goldenText;

    // console.log(req.body.card);
    // let card = req.body.card;
    // res.json(Object.values(card));
    // res.json(req.body);
});


module.exports = cardRoutes;