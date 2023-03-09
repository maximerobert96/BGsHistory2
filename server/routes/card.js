const express = require("express");

const cardRoutes = express.Router();

cardRoutes.route("/card").get(function (req,res) {
    res.json({ blu: "Wrathweaver" });
});

module.exports = cardRoutes;