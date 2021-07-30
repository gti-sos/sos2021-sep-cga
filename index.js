const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
app.use(bodyParser.json());
const BASE_API_URL = "/api/v1";
const port = process.env.PORT || 80;

//----------------------------------coef
const realmadridAPI = require(path.join(__dirname, "coefAPI"));
const dbRM = path.join(__dirname,"realmadridAPI/realmadridAPI.db");
realmadridAPI(app);
//----------------------------------fin-coef


app.use("/", express.static("./public"));

app.listen(port, () => {
	console.log("Server ready");
});

console.log("Starting server...");