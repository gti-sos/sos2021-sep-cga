var express = require("express");
var path = require("path");

var bodyParser = require("body-parser");
var BASE_API_PATH = "/api/v1"; 
var app = express();

app.use(bodyParser.json());
app.use(express.json());

var DataStore = require("nedb");
var datafile = path.join(__dirname, 'medalAPI.db');
var db = new DataStore({filename: datafile, autoload: true});

module.exports.register = (app, BASE_API_PATH) => { 

    var medal_data =[];

app.get(BASE_API_PATH + "/medalAPI/loadInitialData", (req, res) => {
    medal_data = [
        {
            "country": "EEUU",
            "player": 264,
            "sports": 291,
            "gold_medal": 46,
            "silver_medal":37,
            "bronze_medal": 38
        },
        {
            "country": "UK",
            "player": 366,
            "sports": 25,
            "gold_medal": 27,
            "silver_medal":23,
            "bronze_medal": 17
        },
        {
            "country": "China",
            "player": 392,
            "sports": 32,
            "gold_medal": 26,
            "silver_medal":18,
            "bronze_medal": 26
        },
        {
            "country": "Russia",
            "player": 282,
            "sports": 25,
            "gold_medal": 19,
            "silver_medal":17,
            "bronze_medal": 20
        },
        {
            "country": "Germany",
            "player": 422,
            "sports": 27,
            "gold_medal": 17,
            "silver_medal":10,
            "bronze_medal": 15
        }
   ];
   

  db.find({ $or: [{ country: "EEUU" }, { country: "China" }] }, { _id: 0 }, function (err, data) {
    if (err) {
        console.error("ERROR accesing DB in GET");
        res.sendStatus(500);
    } else {
        if (data.length == 0) {
            db.insert(medal_data);
            console.log(`Loaded initial data: <${JSON.stringify(medal_data, null, 2)}>`);
            res.sendStatus(201);
        } else {
            console.error(`initial data already exists`);
            res.sendStatus(409);
        }
    }
});
})

app.get(BASE_API_PATH + "/medalAPI", (req,res)=>{
    var query = req.query;

//Aquí se obtienen offset y limit con query, si son null, le hacemos un delete y listo.
var limit = parseInt(query.limit);
var offset = parseInt(query.offset);

//Borramos los offset y limit.
delete query.offset;
delete query.limit;

//Parseamos las propiedades a Integer
if (query.hasOwnProperty("player")) {
	query.player = parseInt(query.player);
	console.log(query.player);
}
if (query.hasOwnProperty("sports")) {
	query.sports = parseInt(query.sports);
	console.log(query.sports);
}
if (query.hasOwnProperty("gold_medal")) {
	query.gold_medal = parseInt(query.gold_medal);
	console.log(query.gold_medal);
}
if (query.hasOwnProperty("silver_medal")) {
	query.silver_medal = parseInt(query.silver_medal);
	console.log(query.silver_medal);
}
if (query.hasOwnProperty("bronze_medal")) {
	query.bronze_medal = parseInt(query.bronze_medal);
	console.log(query.bronze_medal);
}

console.log(query);

db.find(query).skip(offset).limit(limit).exec((error, medal_stats) => {
	medal_stats.forEach((n) => {
		delete n._id;
    });

	if (medal_stats.length < 0) {
		res.sendStatus(400, "Bad request");
		console.log("Requested data is INVALID");
	}
    else {
		res.send(JSON.stringify(medal_stats, null, 2));
		console.log("Data sent:" + JSON.stringify(medal_stats, null, 2));

	}
});
});


 app.post(BASE_API_PATH + "/medalAPI", (req, res) => {
   var data = req.body;
   var country = req.body.country;
    var player = req.body.player;

	db.find({ "country": country, "player": player }).exec((error, medal_stats) => {
		if (medal_stats.length > 0) {
			res.sendStatus(409);
			console.log("There's an object with those primary keys");
			return;
		}
		if ((data == null)
				|| (data.country == null)
				|| (data.player == null)
				|| (data.sports == null)
				|| (data.gold_medal == null)
				|| (data.silver_medal == null)
                || (data.bronze_medal == null)
				|| ((Object.keys(data).length != 6))) {

				res.sendStatus(400, "Falta uno o más campos");
				console.log(data);
				console.log("POST not created");
				return;
			}
			db.insert(data);

			res.sendStatus(201, "Post created");
			console.log(JSON.stringify(data, null, 2));
		});
});

app.get(BASE_API_PATH + "/medalAPI/:country/:player", (req, res) => {
   var country = req.params.country;
   var player = parseInt(req.params.player);

   db.find({ "country": country, "player": player }).exec((err, param) => {
    if (param.length == 1) {
        delete param[0]._id;
  res.send(JSON.stringify(param[0], null, 2));
  console.log("/GET - Recurso Específico /country/player: " + JSON.stringify(param[0]), null, 2);
}
else {
  res.sendStatus(404, "Not found");
}
});

});


app.delete(BASE_API_PATH + "/medalAPI/:country/:player", (req, res) => {
   var country = req.params.country;
   var player = parseInt(req.body.player);
ºdb.remove({ "country": country, "player": player }, { multi: true }, (err, paramsDeleted) => {
            if (paramsDeleted == 0) {
                res.sendStatus(404, "Not found");
       }
   else {
    res.sendStatus(200);
}
});
});


app.put(BASE_API_PATH + "/medalAPI/:country/:player", (req, res) => {
           var countryData = req.params.country; //Pillar el contenido después de los dos puntos.
           var countryD = req.body.country;
   
           var playerData = parseInt(req.params.player);
           var playerD = parseInt(req.body.player);
   
           var body = req.body;
           if (countryData != countryD || playerData != playerD) {
               res.sendStatus(409);
               console.warn("There is a conflict!");
       }
       else {
        db.update({ "country": countryData, "player": playerData }, body, (err, paramsUpdated) => {
            if (paramsUpdated == 0) {
                res.sendStatus(404, "Not found");
            }
            else {
                res.sendStatus(200);
                console.log("PUT Correcto");
            }
        });
    }
});


app.post(BASE_API_PATH + "/medalAPI/:country/:date", (req, res) => {
   console.log("POST no valido/encontrado");
   return res.sendStatus(405);

});


app.put(BASE_API_PATH + "/medalAPI", (req, res) => {
   console.log("PUT no valido/encontrado");
   return res.sendStatus(405);

});


app.delete(BASE_API_PATH + "/medalAPI", (req, res) => {
   db.remove({}, { multi: true }, (error, medal_stats_deleted) => {
    console.log(medal_stats_deleted + " medal_stats deleted");
});
res.sendStatus(200, "OK");

});

};