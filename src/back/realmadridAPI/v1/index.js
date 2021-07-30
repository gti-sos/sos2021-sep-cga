module.exports = function (app) {
    console.log("Registering Real Madrid API....");
    const dataStore = require ("nedb");
    const path = require ("path");
    const dbFileName =path.join(__dirname,"./realmadridAPI.db"); 
    const BASE_API_URL="/api/v1";   

    const dbRM = new dataStore({
        filename: dbFileName,
        autoload:true
    });
	
var initialRM = [
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

	
    function deleteIDs (rm){
        rm.forEach( (m) => {
            delete m._id;
        });
    }




//LOADINITIALDATA RMBD-----------------------------------------------
    app.get(BASE_API_URL + "/realmadridAPI/loadInitialData", (req, res) => {
		dbRM.remove({});
        	console.log("New GET .../loadInitialData")
        dbRM.insert(initialRM);
            console.log("Initial coef loaded: " + JSON.stringify(initialRM, null, 2));
				res.send(JSON.stringify(initialRM,null,2));
    });
	

	
// POST GLOBAL-coef----------------------------------------------------

	app.post(BASE_API_URL+"/realmadridAPI", (req, res) => {
        var rm = req.body;

		if((rm == {}) 
			 || (rm.competition == null) 
             || (rm.year == null) 
			 || (rm.points == null) 
			 || (rm.goal_score == null) 
		     || (rm.win_games == null)
             || (rm.classification == null)){	
			res.sendStatus(400,"BAD REQUEST");
		} else {
			dbRM.insert(rm);
			
			res.sendStatus(201, "CREATED");
		}
	});	
	
	
	
// DELETE global-coef-----------------------------------------------
	app.delete(BASE_API_URL + "/realmadridAPI", (req,res)=>{
		dbRM.remove({}, { multi: true }, function (err, numRemoved) {
            if (numRemoved>=1) {
                res.sendStatus(200, "OK");
            }else{
                res.sendStatus(404, "NOT FOUND");
            }
          
        });
    });
	
	
//GET GLOBAL-coef/team/year----------------------------------------------

	app.get(BASE_API_URL+"/realmadridAPI/:competition/:year", (req,res)=>{
	
	var competition = req.params.competition;
	var year =  parseInt(req.params.year);
       
        dbRM.find({$and: [{"competition": competition},{"year": year}]  },(err,rm)=>{
            console.log(rm);
            if (rm.length != 0) {
                deleteIDs(rm);
                res.send(JSON.stringify(rm[0],null,2));
                console.log("Data sent: " + JSON.stringify(rm[0],null,2));
            } else{
                res.sendStatus(404, "NOT FOUND");
            }
        })
	});
	


	
// PUT global-coef/team/year--------------------------------------------------

app.put(BASE_API_URL+"/realmadridAPI/:competition/:year", (req, res) =>{
  
  	var competition = req.params.competition;
	var year =  parseInt(req.params.year);
	var updateRM = req.body;
  

		dbRM.update({competition: competition, year: year}, updateRM, (error, numRemoved) => {
			// Checking if any data has been updated (numRemoved>=1)
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		});

	});





// DELETE global-coef/team/year------------------------------------------------

app.delete(BASE_API_URL+"/realmadridAPI/:competition/:year", (req,res)=>{
	
	var competition = req.params.competition;
	var year =  parseInt(req.params.year);
	
	var query = {competition: competition, year:year};
		
		dbRM.remove(query, { multi: true }, (error, numRemoved) => {
			if (numRemoved == 0) {
				res.sendStatus(404, "NOT FOUND");
			} else {
				res.sendStatus(200, "OK");
			}
		}); 
	});
	
	
	
	
	
//POST error-----------------------------------------------------------
app.post(BASE_API_URL + "/realmadridAPI/:competition/:year", (req, res) => {
    res.sendStatus(405);
});

//PUT error--------------------------------------------------------------
app.put(BASE_API_URL + "/realmadridAPI/:competition/:year", (req, res) => {
    res.sendStatus(405);
});  


	
	
	
	
//Búsqueda por todos los campos del recurso------------------------------


	
	app.get(BASE_API_URL+"/realmadridAPI",(req, res) => {
 console.log("GET GLOBAL RMDATA");
 
 

 if(req.query.year) req.query.year = parseInt(req.query.year);
 if(req.query.points) req.query.points = parseInt(req.query.points);
 if(req.query.goal_score) req.query.goal_score = parseInt(req.query.goal_score);
 if(req.query.win_games) req.query.win_games = parseInt(req.query.win_games);
 if(req.query.classification) req.query.classification = parseInt(req.query.classification);
 
	var parametros = req.query;
	console.log(parametros);

 		let offset = null;
		let limit = null;
		
		
		if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
            delete req.query.limit;
        }		
		dbRM.find(parametros).skip(offset).limit(limit).exec((err, rm) => {
  
  			rm.forEach((c) => {
  			 delete c._id;
  			});
			

  
  res.send(JSON.stringify(rm,null,2));
  console.log("RESOURCES DISPLAYED");
 });
 

	});
	
}
	