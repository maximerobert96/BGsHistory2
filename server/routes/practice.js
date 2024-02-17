const express = require("express");
const dbManager = require('../db/dbManager');

const practiceRoutes = express.Router();

// default route.
practiceRoutes.route("/practice").get(function(req,res) {
    // let patchId = req.params.id;
    // let mode = "COMPACT";
    // let changes = [];
    // if(req.query.mode) {
    //     mode = req.query.mode;
    // }
    // changes = dbManager.getChangesOfPatch(patchId, mode);
    res.json([{dbfId:96812, name: "Annoy-O-Module"}, {dbfId:736, name: "Old Murk-Eye"}, {dbfId: 5, name: "Jeff"}]);
});




module.exports = practiceRoutes;