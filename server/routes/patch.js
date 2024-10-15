const express = require("express");
const dbManager = require('../db/dbManager');
const optimizerFunctions = require("../db/optimization/optimizationFilesFunctions");

const patchRoutes = express.Router();

patchRoutes.route("/patch/:id").get(function(req,res) {
    let patchId = req.params.id;
    let changes;
    changes = dbManager.getChangesOfPatch(patchId);
    res.json(changes);
});

patchRoutes.route("/patch2/:id").get(function(req,res) {
    let patchId = req.params.id;
    let changes;
    changes = optimizerFunctions.getChangesOfPatch(patchId);
    res.json(changes);
});

patchRoutes.route("/patch-info/:id").get(function(req,res) {
    let patchId = req.params.id;
    let patchInfo = dbManager.getJsonFromFile("../patches.json")[patchId];
    res.json(patchInfo);
});


module.exports = patchRoutes;