const express = require("express");
// const fs = require('fs');
const dbManager = require('../db/dbManager')

const cardRoutes = express.Router();

cardRoutes.route("/card").get(function(req,res) {
    let activeCards = dbManager.getActiveCards();
    res.json(activeCards);
});

// cardRoutes.route("/card/:id").get(async function (req,res) {
//     try{
//         let id = Number(req.params.id);
//         const db = fs.readFileSync('db/cards.json');
//         const json = JSON.parse(db);
//         let searched_card = json.find(o => o.version_id == id);
//         res.json(searched_card);

//     } catch (error){
//         console.error(error);
//         return;
//     }
// });

module.exports = cardRoutes;