var express = require("express");
var path = require("path");

var bodyParser = require("body-parser");
var BASE_API_PATH = "/api/v1"; 
var app = express();

app.use(bodyParser.json());
app.use(express.json());

var DataStore = require("nedb");
var datafile = path.join(__dirname, 'realmadridAPI.db');
var db = new DataStore({filename: datafile, autoload: true});

module.exports.register = (app, BASE_API_PATH) => { 

    var realmadrid_data =[];

app.get(BASE_API_PATH + "/realmadridAPI/loadInitialData", (req, res) => {
    realmadrid_data = [
		{ 
			competition: "La Liga",
			year: 2001,
			points: 80,
			goal_score: 81,
			win_games: 24,
			classification: 1
		},
		{ 
			competition: "La Liga",
			year: 2002,
			points: 66,
			goal_score: 69,
			win_games: 19,
			classification: 3
		},
		{ 
			competition: "La Liga",
			year: 2003,
			points: 78,
			goal_score: 86,
			win_games: 22,
			classification: 1
		},
		{ 
			competition: "La Liga",
			year: 2004,
			points: 70,
			goal_score: 72,
			win_games: 21,
			classification: 4
		},
		{ 
			competition: "La Liga",
			year: 2005,
			points: 80,
			goal_score: 71,
			win_games: 25,
			classification: 2
		},
		{ 
			competition: "La Liga",
			year: 2006,
			points: 70,
			goal_score: 70,
			win_games: 20,
			classification: 2
		}
   ];
   

  db.find({ $or: [{ year: "2001" }, { year: "2002" }] }, { _id: 0 }, function (err, data) {
    if (err) {
        console.error("ERROR accesing DB in GET");
        res.sendStatus(500);
    } else {
        if (data.length == 0) {
            db.insert(realmadrid_data);
            console.log(`Loaded initial data: <${JSON.stringify(realmadrid_data, null, 2)}>`);
            res.sendStatus(201);
        } else {
            console.error(`initial data already exists`);
            res.sendStatus(409);
        }
    }
});
})
app.get(BASE_API_PATH + "/realmadridAPI", (req,res)=>{
    var query = req.query;

//Aquí se obtienen offset y limit con query, si son null, le hacemos un delete y listo.
var limit = parseInt(query.limit);
var offset = parseInt(query.offset);

//Eliminamos los offset y limit.
delete query.offset;
delete query.limit;

//Parseamos las propiedades numéricas
if (query.hasOwnProperty("year")) {
	query.year = parseInt(query.year);
	console.log(query.year);
}
if (query.hasOwnProperty("points")) {
	query.points = parseInt(query.points);
	console.log(query.points);
}
if (query.hasOwnProperty("goal_score")) {
	query.goal_score = parseInt(query.goal_score);
	console.log(query.goal_score);
}
if (query.hasOwnProperty("win_games")) {
	query.win_games = parseInt(query.win_games);
	console.log(query.win_games);
}
if (query.hasOwnProperty("classification")) {
	query.classification = parseInt(query.classification);
	console.log(query.classification);
}

console.log(query);

db.find(query).skip(offset).limit(limit).exec((error, realmadrid_stats) => {
	realmadrid_stats.forEach((n) => {
		delete n._id;
    });

	if (realmadrid_stats.length < 0) {
		res.sendStatus(400, "Bad request");
		console.log("Requested data is INVALID");
	}
    else {
		res.send(JSON.stringify(realmadrid_stats, null, 2));
		console.log("Data sent:" + JSON.stringify(realmadrid_stats, null, 2));

	}
});
});


 app.post(BASE_API_PATH + "/realmadridAPI", (req, res) => {
   var data = req.body;
   var competition = req.body.competition;
var year = req.body.year;

	db.find({ "competition": competition, "year": year }).exec((error, realmadrid_stats) => {
		if (realmadrid_stats.length > 0) {
			res.sendStatus(409);
			console.log("There's an object with those primary keys");
			return;
		}
		if ((data == null)
				|| (data.competition == null)
				|| (data.year == null)
				|| (data.points == null)
				|| (data.goal_score == null)
				|| (data.win_games == null)
				|| (data.classification == null)
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

app.get(BASE_API_PATH + "/realmadridAPI/:competition/:year", (req, res) => {
   var competition = req.params.competition;
   var year = parseInt(req.params.year);

   db.find({ "competition": competition, "year": year }).exec((err, param) => {
    if (param.length == 1) {
        delete param[0]._id;
  res.send(JSON.stringify(param[0], null, 2));
  console.log("/GET - Recurso Específico /competition/year: " + JSON.stringify(param[0]), null, 2);
}
else {
  res.sendStatus(404, "Not found");
}
});

});


app.delete(BASE_API_PATH + "/realmadridAPI/:competition/:year", (req, res) => {
   var competition = req.params.competition;
   var year = parseInt(req.body.year);

           db.remove({ "competition": competition, "year": year }, { multi: true }, (err, paramsDeleted) => {
            if (paramsDeleted == 0) {
                res.sendStatus(404, "Not found");
       }
   else {
    res.sendStatus(200);
}
});
});


app.put(BASE_API_PATH + "/realmadridAPI/:competition/:year", (req, res) => {
  
           var competitionData = req.params.competition; //Pillar el contenido después de los dos puntos.
           var competitionD = req.body.competition;
   
           var yearData = parseInt(req.params.year);
           var yearD = parseInt(req.body.year);
   
           var body = req.body;
           if (competitionData != competitionD || yearData != yearD) {
               res.sendStatus(409);
               console.warn("There is a conflict!");
       }
       else {
        db.update({ "competition": competitionData, "year": yearData }, body, (err, paramsUpdated) => {
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
   /*}
}); */


app.post(BASE_API_PATH + "/realmadridAPI/:competition/:date", (req, res) => {
   console.log("POST no valido/encontrado");
   return res.sendStatus(405);

});


app.put(BASE_API_PATH + "/realmadridAPI", (req, res) => {
   console.log("PUT no valido/encontrado");
   return res.sendStatus(405);

});


app.delete(BASE_API_PATH + "/realmadridAPI", (req, res) => {
  
   db.remove({}, { multi: true }, (error, realmadrid_stats_deleted) => {
    console.log(realmadrid_stats_deleted + " realmadrid_stats deleted");
});
res.sendStatus(200, "OK");

});

};