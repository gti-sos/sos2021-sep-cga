var express = require("express");
var bodyParser = require("body-parser");
var medalapi = require("./medalAPI");
var port = (process.env.PORT || 10000);


var BASE_API_PATH = "/api/v1"; 

var app = express();
app.use(bodyParser.json());
app.use(express.json());

medalapi.register(app, BASE_API_PATH);

var path = require("path");

app.use("/", express.static(path.join(__dirname,"public")));

app.listen(port, () => {
    console.log(`Server ready listening on ${port}`);
});