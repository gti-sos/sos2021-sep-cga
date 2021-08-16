var express = require("express");
var request = require('request');
var path = require("path");
var app = express();
var bodyParser = require("body-parser");
var PORT = (process.env.PORT || 10000);

var olimpic_APIv1 =  require("./src/backend/v1/olimpicAPI");
var olimpic_APIv2 =  require("./src/backend/v2/olimpicAPI");

var olimpicAPIAllowList = {"rentals": "https://sos2021-07.herokuapp.com/api/v1/rentals"};
app.use("/olimpicAPI/proxyRequest/:api", function(req, res) {
    let NameApi = req.params.api;

    if(NameApi in olimpicAPIAllowList){
        let url = olimpicAPIAllowList[NameApi] + req.url;

        console.log(olimpicAPIAllowList[NameApi]);
        console.log(req.url);
        console.log(url);
        req.pipe(request(url)).pipe(res);
    }else{
        res.sendStatus(400);
    }
});


app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname,"public")));


olimpic_APIv1.register(app);
olimpic_APIv2.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});