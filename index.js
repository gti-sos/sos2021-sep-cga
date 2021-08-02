var express = require("express");

var path = require("path");

var bodyParser = require("body-parser");

var olimpic_APIv1 =  require("./olimpicAPI/v1");
var olimpic_APIv2 =  require("./olimpicAPI/v2");


var PORT = (process.env.PORT || 10000);

var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname,"public")));


olimpic_APIv1.register(app);
olimpic_APIv2.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});