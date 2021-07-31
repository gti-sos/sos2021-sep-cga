var BASE_API_PATH = "/api/v1/olimpic-stats";

var path = require("path");

var Datastore = require("nedb");

const dbFileName = path.join(__dirname,"olimpic-stats.db");

const dbOlimpic = new Datastore({
				filename: dbFileName, 
				autoload: true,
					autoload: true,
				autoload: true,
				autoload: true
		});


var olimpicInitialData = [
	{
		"city": "Rio",
		"year": 2016,
		"players": 306,
		"gold_medal": 7,
		"silver_medal": 4,
		"bronze_medal": 6,
	},
	{
		"city": "London",
		"year": 2012,
		"players": 278,
		"gold_medal": 4,
		"silver_medal": 10,
		"bronze_medal": 4,
	},
	{
		"city": "Pekin",
		"year": 2008,
		"players": 286,
		"gold_medal": 5,
		"silver_medal": 11,
		"bronze_medal": 3,
	},
	{
		"city": "Athens",
		"year": 2004,
		"players": 317,
		"gold_medal": 3,
		"silver_medal": 11,
		"bronze_medal": 6,
	},
	{
		"city": "Sidney",
		"year": 2000,
		"players": 323,
		"gold_medal": 3,
		"silver_medal": 3,
		"bronze_medal": 5,
	}
];


 module.exports.register = (app) => {


	//OBTIENE TODO EL ARRAY
    app.get(BASE_API_PATH, (req,res)=>{
		var dbquery = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
		var i = 0;
        //PAGINACIÓN
        if (req.query.offset) {
            offset = parseInt(req.query.offset);
            delete req.query.offset;
        }
        if (req.query.limit) {
            limit = parseInt(req.query.limit);
            delete req.query.limit;
        }

        //BUSQUEDA
        if(req.query.city){
			 dbquery["city"]= req.query.city;
			i++;
		}
        if(req.query.year){
			dbquery["year"] = parseInt(req.query.year);
			i++
		} 
        if(req.query.players){
			dbquery["players"] = parseInt(req.query.players);
			i++
		} 
        if(req.query.gold_medal){
			dbquery["gold_medal"] = parseInt(req.query.gold_medal);
			i++
		} 
		
        if(req.query.silver_medal){
			dbquery["silver_medal"] = parseInt(req.query.silver_medal);
			i++
		} 
		if(req.query.bronze_medal){
			dbquery["bronze_medal"] = parseInt(req.query.bronze_medal);
			i++
		}
	

        dbOlimpic.find(dbquery).sort({city:1,year:-1}).skip(offset).limit(limit).exec((err, olimpic) =>{

            
			if(err){
				res.sendStatus(500);
			}else{
				if(olimpic.length==0){
					if(i==0){
						res.send(JSON.stringify(olimpic,null,2));
					}else{
						console.log();
						res.sendStatus(404);
					}
				}
				else{
					olimpic.forEach((f)=>{
                delete f._id
            		});
					if(olimpic.length==1){
						res.send(JSON.stringify(olimpic[0],null,2));
					}
					else{
						res.send(JSON.stringify(olimpic,null,2));
					}
					
				
					
				}
			}
           
        });

    });

	//LOAD INITIAL DATA
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
		dbOlimpic.insert(olimpicInitialData);

        res.send("Datos cargados");
    });

	  
	
    //SUBE UN RECURSO
    app.post(BASE_API_PATH, (req,res)=>{
        var newOlimpic = req.body;
       
        dbOlimpic.find({$and: [{city: newOlimpic.city}, {year: newOlimpic.year}, {players: newOlimpic.players}]}, (err, olimpic_size)=>{
		if(err){
			console.error("ERROR accessing 	DB in GET");
			res.sendStatus(500);
		}
		else{
			console.log(Object.keys(newOlimpic));
			if(olimpic_size.length==0){
			
				if((!newOlimpic.city|!newOlimpic.year|!newOlimpic.players|!newOlimpic.gold_medal|!newOlimpic.silver_medal|
					!newOlimpic.bronze_medal) || Object.keys(newOlimpic).length!=6 ){
					res.sendStatus(400);
					
					
				}else{
					console.log("Inserting new olimpic_size in DB: "+ JSON.stringify(newOlimpic, null,2));
					dbOlimpic.insert(newOlimpic);
					res.sendStatus(201); //CREATED
				}
				
			}
			else{
				console.log();
				res.sendStatus(409); //CONFLICT
			}
		}
	});

    });

    	 //BORRAR RECURSO
         app.delete(BASE_API_PATH+"/:city/:year/:players", (req,res)=>{
            var cityD = req.params.city;
            var yearD = parseInt(req.params.year);
			var playersD = parseInt(req.params.players);
            dbOlimpic.remove({$and:[{ city: cityD}, {year: yearD }, { players: playersD }]}, {}, (err, numOlimpicRemoved)=>{
            if (err){
                console.error("ERROR deleting DB olimpic_size in DELETE: "+err);
                res.sendStatus(500);
            }else{
                
                if(numOlimpicRemoved==0){
                    res.sendStatus(404);
                }else{
                    res.sendStatus(200);
                }
            }
        });
            
        });
           //ACTUALIZA RECURSO
    app.put(BASE_API_PATH+"/:city/:year/:players",(req,res)=>{
		var cityD = req.params.city;
		var yearD = parseInt(req.params.year);
		var playersD = parseInt(req.params.players);
		var update = req.body;
		dbOlimpic.find({$and:[{ city: cityD}, {year: yearD }, {players: playersD}]}, (err, olimpic)=>{
			if (err){
				console.error("ERROR accessing 	DB in GET");
					res.sendStatus(500);
			}
			else{
				if((req.body.city!=cityD|req.body.year!=yearD|req.body.players!=playersD)){
					res.sendStatus(409);
				}else if(!update.city|!update.year|!update.players|!update.gold_medal|!update.silver_medal|!update.bronze_medal | Object.keys(update).length != 6){
					res.sendStatus(400);
				}else{
					dbOlimpic.update({$and:[{ city: cityD}, {year: yearD }, {players: playersD}]}, {$set: update}, {},function(err, updateOlimpic) {
						if (err) {
							console.error("ERROR updating DB olimpic_size in PUT: "+err);
						}else{
						res.sendStatus(200);
					
						}
					});
				}
			}
		});
	});
		
      //ERROR AL POST EN UN RECURSO
      app.post(BASE_API_PATH+"/:city/:year/:players", (req,res)=>{

        res.sendStatus(405);
    });


    //ERROR AL ACTUALIZAR UN ARRAY
    app.put(BASE_API_PATH, (req,res)=>{

        res.sendStatus(405);
    });
	//BORRAR TODO
	app.delete(BASE_API_PATH, (req,res)=>{
		dbOlimpic.remove({}, {multi:true}, (err, numOlimpicRemoved)=>{
		if (err){
			console.error("ERROR deleting DB olimpic_size in DELETE: "+err);
		}else{
			if(numOlimpicRemoved==0){
				res.sendStatus(404);
			}else{
				res.sendStatus(200);
			}
		}
	});
	});
	
	app.get(BASE_API_URL+"/:city", (req, res)=>{
		var cityParam = req.params.city;
		dbOlimpic.find({city: cityParam}, (err,olimpic_stats)=>{
			olimpic_stats.forEach((c)=>{
				delete c._id;
			});

			if(olimpic_stats.length>=1){
				res.send(JSON.stringify(olimpic_stats, null, 2));
			}else{
				res.sendStatus(404,"NOT FOUND")
			}

		});
	});
 };

 