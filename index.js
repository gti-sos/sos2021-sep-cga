var express = require("express");

var app = express();

var port = (process.env.PORT || 10000);


app.use("/", express.static(path.join(__dirname,"public")));

app.get("/v1", (req, res) => {
    res.send("<html><body><h1>Buenas GET</h1></body></html>")
});

app.post("/v1", (req, res) => {
    res.send("<html><body><h1>Buenas POST</h1></body></html>")
});

app.listen(port, () => {
    console.log(`Server ready listening on port ${port}`);
});