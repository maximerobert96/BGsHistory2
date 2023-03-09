const express = require("express");
const { JsonDB, Config } = require("node-json-db");

var db = new JsonDB(new Config("db/cards", true, true, '/'));

const cardRoutes = express.Router();

cardRoutes.route("/card").get(async function (req,res) {
    var data = null;
    try{
        data = await db.getData("/");
    } catch (error){
        console.error(error);
        return;
    }
    res.json(data);
});

module.exports = cardRoutes;