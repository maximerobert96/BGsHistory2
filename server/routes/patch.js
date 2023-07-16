const express = require("express");
const dbManager = require('../db/dbManager');

const patchRoutes = express.Router();

patchRoutes.route("/patch/:id").get(function(req,res) {
    let patchId = req.params.id;
    let mode = "COMPACT";
    let changes = [];
    if(req.query.mode) {
        mode = req.query.mode;
    }
    changes = dbManager.getChangesOfPatch(patchId, mode);
    res.json(changes);
});



module.exports = patchRoutes;