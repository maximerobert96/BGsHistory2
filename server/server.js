const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(require("./routes/card"));
app.use(require("./routes/patch"));
app.use(require("./routes/practice"));
app.use(require("./routes/cardpool"));

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});