const express = require("express");
const dbManager = require('../db/dbManager');

const cardRoutes = express.Router();

cardRoutes.route("/cards").get(function(req,res) {
    let activeCards;
    let tribes;
    if(req.query.tribes) {
        tribes = req.query.tribes;
        tribes = typeof tribes === "string"? [tribes] : tribes;
        activeCards = dbManager.getActiveCards(tribes);
    } else {
        activeCards = dbManager.getActiveCards();
    }
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

cardRoutes.route("/:patchId/cards/").get(function(req, res) {
    let activeCards;
    let tribes;
    let patchId = req.params.patchId;
    if(req.query.tribes) {
        tribes = req.query.tribes;
        tribes = typeof tribes === "string"? [tribes] : tribes;
        activeCards = dbManager.getActiveCardsOfPatch(patchId, tribes);
    } else {
        activeCards = dbManager.getActiveCardsOfPatch(patchId);
    }
    res.json(activeCards);
});


module.exports = cardRoutes;