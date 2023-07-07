const express = require("express");
const dbManager = require('../db/dbManager')

const cardRoutes = express.Router();

cardRoutes.route("/card").get(function(req,res) {
    let activeCards = dbManager.getActiveCards();
    res.json(activeCards);
});

cardRoutes.route("/card/:id").get(function(req, res) {
    try {
        let card = dbManager.getCardById(req.params.id);
        res.json(card);
    } catch (error) {
        res.status(404);
        res.json({error: error.message});
        
    }
});


module.exports = cardRoutes;