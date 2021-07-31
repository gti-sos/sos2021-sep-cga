var express = require("express");

var path = require("path");

var bodyParser = require("body-parser");

var olimpic_API =  require("./olimpicAPI");


var PORT = (process.env.PORT || 10000);

var app = express();
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname,"public")));


olimpic_API.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});