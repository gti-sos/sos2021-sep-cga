//var cool =  require("cool-ascii-faces");
var express = require("express");
var path = require("path");
var app = express();


var port = (process.env.PORT || 10000);

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/hello",(req,res) => {
    //response.send(cool());
    res.send("Hello from this tiny server");
    //console.log("New request has arrived");

});

app.post("/hello",(req,res) => {
    res.send("Hello from this tiny server");
});

app.listen(port, () => {
    console.log(`Server ready listening on ${port}`);
});
//console.log(cool());
//FORMA SÍNCRONA (PEOR)
//app.listen(port);
//console.log(`Server ready listening on ${port}`);