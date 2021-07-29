//var cool = require("cool-ascii-faces");
var express = require("express");
var path = require("path");

var bodyParser = require("body-parser");
var BASE_API_PATH = "/api/v1"; 
var app = express();

app.use(bodyParser.json());
app.use(express.json());

var DataStore = require("nedb");
var datafile = path.join(__dirname, 'psychology-stats.db');
var db = new DataStore({filename: datafile, autoload: true});
//app.use("/", express.static(path.join(__dirname,"public")));




/* F02
app.get("/info/psychology_stats", (request,response)=>{
    response.send(`<!DOCTYPE html>
    <html>
        <head>
            <title>psychology_stats</title>
            <style>
                table, tr, td , th{
                    border: 1px solid black;
                    border-collapse: collapse;
                }
                tr, td {
                    padding: 5px;
                    text-align: center;    
                }
            </style>
        </head>
        <body>
            <h3>Psicología - Datos en las comunidades autónomas de España</h3>
             </br>
             <table class="default" style="width:100%">
            <tr>
                <th>country</th>
                <th>year</th>
                <th>psy_women</th>
                <th>psy_men</th>
                <th>psy_population</th>
            </tr>
            <tr>
                <td>Spain_Andalucia</td>
                <td>2017</td>
                <td>6,06</td>
                <td>4,86</td>
                <td>5,47</td>
		
            </tr>
            <tr>
                <td>Spain_Aragón</td>
                <td>2017</td>
                <td>6,94</td>
                <td>3,46</td>
                <td>5,22</td>
            </tr>
            <tr>
                <td>Spain-Asturias</td>
                <td>2017</td>
                <td>8,36</td>
                <td>4,98</td>
                <td>6,74</td>
            </tr>
    
            <tr>
                <td>Spain-Baleares</td>
                <td>2017</td>
                <td>4,29</td>
                <td>3,59</td>
                <td>3,94</td>
            </tr>
            <tr>
                <td>Spain-Canarias</td>
                <td>2017</td>	
                <td>3,71</td>
                <td>3,28</td>
                <td>3,5</td>
            </tr>
            <tr>
                <td>Spain-Cantabria</td>
                <td>2017</td>
                <td>3,26</td>
                <td>2,73</td>
                <td>3</td>
            </tr>
            </table>
        </body>
        </html>`
        );
});	*/
module.exports.register = (app, BASE_API_PATH) => { 

    var psychology_stats_data =[];

app.get(BASE_API_PATH + "/psychology-stats/loadInitialData", (req, res) => {
    psychology_stats_data = [
       {
           "country": 'Spain_Andalucia',
           "year": 2017,
           "psychology_women": 6.06,
           "psychology_men": 4.86,
           "psychology_population": 5.47
       },
       {
           "country": 'Spain_Aragon',
           "year": 2017,
           "psychology_women": 6.94,
           "psychology_men": 3.46,
           "psychology_population": 5.22
       },
       {
           "country": 'Spain_Asturias',
           "year": 2017,
           "psychology_women": 8.36,
           "psychology_men": 4.98,
           "psychology_population": 6.74
       },
       {
           "country": 'Spain_Baleares',
           "year": 2017,
           "psychology_women": 4.29,
           "psychology_men": 3.59,
           "psychology_population": 3.94
       },
       {
           "country": 'Spain_Canarias',
           "year": 2017,
           "psychology_women": 3.71,
           "psychology_men": 3.28,
           "psychology_population": 3.5
       },
       {
           "country": 'Spain_Cantabria',
           "year": 2017,
           "psychology_women": 3.26,
           "psychology_men": 2.73,
           "psychology_population": 3
       }
   ];
   
 //  console.log(`Loaded Initial Data: <${JSON.stringify(psychology_stats_data, null, 2)}>`);
  // return res.sendStatus(200);

  db.find({ $or: [{ country: "Spain_Andalucia" }, { country: "Spain_Baleares" }] }, { _id: 0 }, function (err, data) {
    if (err) {
        console.error("ERROR accesing DB in GET");
        res.sendStatus(500);
    } else {
        if (data.length == 0) {
            db.insert(psychology_stats_data);
            console.log(`Loaded initial data: <${JSON.stringify(psychology_stats_data, null, 2)}>`);
            res.sendStatus(201);
        } else {
            console.error(`initial data already exists`);
            res.sendStatus(409);
        }
    }
});
})
app.get(BASE_API_PATH + "/psychology-stats", (req,res)=>{
   /*if (psychology_stats_data.length != 0) {
       console.log(`psychology_stats requested`);
     return res.send(JSON.stringify(psychology_stats_data, null, 2));  
   } else {
     console.log("No data found");
     return res.sendStatus(404);
   }
    return res.sendStatus(200);*/

    var query = req.query;

//Aquí se obtienen offset y limit con query, si son null, le hacemos un delete y listo.
var limit = parseInt(query.limit);
var offset = parseInt(query.offset);

//Deleteamos los offset y limit.
delete query.offset;
delete query.limit;

//Parseamos el año a Integer, mis otras 3 propiedades numéricas también son necesarias.
if (query.hasOwnProperty("year")) {
	query.year = parseInt(query.year);
	console.log(query.year);
}
if (query.hasOwnProperty("psychology_women")) {
	query.psychology_women = parseFloat(query.psychology_women);
	console.log(query.psychology_women);
}
if (query.hasOwnProperty("psychology_men")) {
	query.psychology_men = parseFloat(query.psychology_men);
	console.log(query.psychology_men);
}
if (query.hasOwnProperty("psychology_population")) {
	query.psychology_population = parseFloat(query.psychology_population);
	console.log(query.psychology_population);
}

console.log(query);

db.find(query).skip(offset).limit(limit).exec((error, psychology_stats) => {
	psychology_stats.forEach((n) => {
		delete n._id;
    });

	if (psychology_stats.length < 0) {
		res.sendStatus(400, "Bad request");
		console.log("Requested data is INVALID");
	}
    else {
		res.send(JSON.stringify(psychology_stats, null, 2));
		console.log("Data sent:" + JSON.stringify(psychology_stats, null, 2));

	}
});
});


 app.post(BASE_API_PATH + "/psychology-stats", (req, res) => {
   var data = req.body;
   /*psychology_stats_data.push(data);
   console.log(`new data pushed: <${JSON.stringify(psychology_stats_data, null, 2)}>`);
   res.sendStatus(201);*/
   var country = req.body.country;
	var year = req.body.year;

	db.find({ "country": country, "year": year }).exec((error, psychology_stats) => {
		if (psychology_stats.length > 0) {
			res.sendStatus(409);
			console.log("There's an object with those primary keys");
			return;
		}
		if ((data == null)
				|| (data.country == null)
				|| (data.year == null)
				|| (data.psychology_men == null)
				|| (data.psychology_women == null)
				|| (data.psychology_population == null)
				|| ((Object.keys(data).length != 5))) {

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

app.get(BASE_API_PATH + "/psychology-stats/:country/:year", (req, res) => {
   var country = req.params.country;
   var year = parseInt(req.params.year);

   /*console.log(`GET stat by country: <${country}> and year: <${year}>`);
   for (var stat of psychology_stats_data) {
       if (stat.country === country && stat.year === year) {
           return res.status(200).json(stat);
       }
   }*/
   db.find({ "country": country, "year": year }).exec((err, param) => {
    if (param.length == 1) {
        delete param[0]._id;
  // return res.sendStatus(404);
  res.send(JSON.stringify(param[0], null, 2));
  console.log("/GET - Recurso Específico /country/year: " + JSON.stringify(param[0]), null, 2);
}
else {
  res.sendStatus(404, "Not found");
}
});

});


app.delete(BASE_API_PATH + "/psychology-stats/:country/:year", (req, res) => {
   var country = req.params.country;
   var year = parseInt(req.body.year);

   /*console.log(`DELETE by country <${country}> and year: <${year}>`);
   for (var i = 0; i < psychology_stats_data.length; i++) {
       if (psychology_stats_data[i]["country"] === country && psychology_stats_data[i]["year"] === year) {
           psychology_stats_data.splice(i, 1);
           return res.sendStatus(200);*/
           db.remove({ "country": country, "year": year }, { multi: true }, (err, paramsDeleted) => {
            if (paramsDeleted == 0) {
                res.sendStatus(404, "Not found");
       }
  /* }
   return res.sendStatus(404);*/
   else {
    res.sendStatus(200);
}
});
});


app.put(BASE_API_PATH + "/psychology-stats/:country/:year", (req, res) => {
  /* var country = req.params.country;
   var year = parseInt(req.params.year);
   var newDatapsychology = req.body;
   console.log(`PUT ${newDatapsychology.country} OVER ${country} `);
   console.log(`PUT ${newDatapsychology.year} OVER ${year} `);
   if (psychology_stats_data.length == 0) {
       console.log("No Válido")
       return res.sendStatus(404);
   } else {
       for (var i = 0; i < psychology_stats_data.length; i++) {
           var stat = psychology_stats_data[i];
           if (stat.country === country && stat.year === year) {
               psychology_stats_data[i] = newDatapsychology;
               return res.send('PUT success');
           }
           */
           var countryData = req.params.country; //Pillar el contenido después de los dos puntos.
           var countryD = req.body.country;
   
           var yearData = parseInt(req.params.year);
           var yearD = parseInt(req.body.year);
   
           var body = req.body;
           if (countryData != countryD || yearData != yearD) {
               res.sendStatus(409);
               console.warn("There is a conflict!");
       }
       else {
        db.update({ "country": countryData, "year": yearData }, body, (err, paramsUpdated) => {
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


app.post(BASE_API_PATH + "/psychology-stats/:country/:date", (req, res) => {
   console.log("POST no valido/encontrado");
   return res.sendStatus(405);

});


app.put(BASE_API_PATH + "/psychology-stats", (req, res) => {
   console.log("PUT no valido/encontrado");
   return res.sendStatus(405);

});


app.delete(BASE_API_PATH + "/psychology-stats", (req, res) => {
  /* psychology_stats_data.length = 0;
   console.log('psychology_stats deleted');
   return res.sendStatus(200); */

   db.remove({}, { multi: true }, (error, psychology_stats_deleted) => {
    console.log(psychology_stats_deleted + " psychology_stats deleted");
});
res.sendStatus(200, "OK");

});

};