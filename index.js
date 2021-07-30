const express = require("express");
const bodyParser = require("body-parser");
const dataStore = require("nedb");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 1500;

app.use(bodyParser.json());
app.use(cors());

//----------------------------------coef
const rmAPIv1 = require(path.join(__dirname, "./src/back/realmadridAPI/v1"));
rmAPIv1(app)
//----------------------------------fin-coef

app.use("/", express.static("./public"));


app.listen(port, () => {
	console.log("Server ready on:" + port);
});

console.log("Starting server...");