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

cardRoutes.route("/card/:id").get(async function (req,res) {
    // var data = null;
    try{
        let id = Number(req.params.id);
        // console.log(id);
        let data = await db.getData("/");
        // console.log(JSON.stringify(data));
        // let searched_card2 = db.find<Number>('/', entry => entry.version_id == id ); // this one doesn't work
        let searched_card = data.find(o => o.version_id == id); // this one works
        // console.log(JSON.stringify(searched_card));
        // console.log(JSON.stringify(searched_card2));
        // if(searched_card)
        //     console.log(JSON.stringify(searched_card));
        res.json(searched_card);

    } catch (error){
        console.error(error);
        return;
    }
});

module.exports = cardRoutes;