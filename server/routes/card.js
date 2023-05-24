const express = require("express");
const { JsonDB, Config } = require("node-json-db");
const fs = require('fs');

// var db = new JsonDB(new Config("db/cards", true, true, '/'));

const cardRoutes = express.Router();

// cardRoutes.route("/card").get(async function (req,res) {
//     var data = null;
//     try{
//         data = await db.getData("/");
//     } catch (error){
//         console.error(error);
//         return;
//     }
//     res.json(data);
// });

cardRoutes.route("/cards").get(function(req,res) {
    const db = fs.readFileSync('db/cards.json');
    const json = JSON.parse(db);
    res.json(json);
});

module.exports = cardRoutes;