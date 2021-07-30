var express = require("express");
var bodyParser = require("body-parser");

var medalAPI =  require("./medalAPI");

var PORT = (process.env.PORT || 1607);

var app = express();
app.use(bodyParser.json());

medalAPI.register(app);

app.listen(PORT,()=>{
    console.log(`Server ready at ${PORT}!`);
});