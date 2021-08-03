var BASE_API_PATH = "/api/v1/olimpic-stats";
var Datastore = require("nedb");

var path = require('path');
var datafile = path.join(__dirname, 'olimpic-stats.db');
var db = new Datastore({ filename: datafile, autoload: true});

var olimpicInitialData = [
	{
		"city": "Rio",
		"year": 2016,
		"gold_medal": 7,
		"silver_medal": 4,
		"bronze_medal": 6,
	},
	{
		"city": "London",
		"year": 2012,
		"gold_medal": 4,
		"silver_medal": 10,
		"bronze_medal": 4,
	},
	{
		"city": "Pekin",
		"year": 2008,
		"gold_medal": 5,
		"silver_medal": 11,
		"bronze_medal": 3,
	},
	{
		"city": "Athens",
		"year": 2004,
		"gold_medal": 3,
		"silver_medal": 11,
		"bronze_medal": 6,
	},
	{
		"city": "Sidney",
		"year": 2000,
		"gold_medal": 3,
		"silver_medal": 3,
		"bronze_medal": 5,
	}
];

function hasNumbers(t){
	var regex = /\d/g;
	return regex.test(t);
}
 module.exports.register = (app) => {

    app.get(BASE_API_PATH, (req,res)=>{
		var dbquery = {};
        let offset = 0;
        let limit = Number.MAX_SAFE_INTEGER;
		
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
		if(req.query.city) dbquery["city"]= req.query.city;
		if(req.query.year) dbquery["year"] = parseInt(req.query.year);
		if(req.query.gold_medal) dbquery["gold_medal"] = parseInt(req.query.gold_medal);
		if(req.query.silver_medal) dbquery["silver_medal"] = parseInt(req.query.silver_medal);
		if(req.query.bronze_medal) dbquery["bronze_medal"] = parseInt(req.query.bronze_medal);	
		
		db.find(dbquery).sort({city:1,year:-1}).skip(offset).limit(limit).exec((error, olimpic) =>{
			if(error){
				res.sendStatus(500);
			}else{
				if(olimpic.length==0){
						console.log();
						res.send(JSON.stringify(olimpic,null,2));
				}
				else{
					olimpic.forEach((f)=>{
                delete f._id
            });
				if(olimpic.length==1){
						res.status(200).send(JSON.stringify(olimpic,null,2));
					console.log("Recursos mostrados");
					}
					else{
						res.send(JSON.stringify(olimpic,null,2));
					}
					
				}
			}
			
			
		});
    
 });
    
    app.get(BASE_API_PATH+"/loadInitialData", (req, res)=>{
        db.insert(olimpicInitialData);
        
        
		res.sendStatus(200);
    });
    
 
	 
	 app.get(BASE_API_PATH+"/:city/:year", (req, res)=>{
	   var cityD = req.params.city;
		var yearD = parseInt(req.params.year);
	   db.find({ city: cityD , year: yearD }, (err,olimpicInDB)=>{
		if(err){
			console.error("ERROR accessing BB in GET");
			res.sendStatus(500);
		}else{
			if(olimpicInDB.length==0){
				res.sendStatus(404);
			}else{
				var olimpicToSend = olimpicInDB.map((d)=>{
			return {city: d.city, year: d.year, gold_medal: d.gold_medal, silver_medal: d.silver_medal, bronze_medal: d.bronze_medal};
			});
			res.status(200).send(JSON.stringify(olimpicToSend[0],null,2));
			}
			
		}
		
	});
    });
	
	 
    app.post(BASE_API_PATH, (req,res)=>{
        var newOlimpic = req.body;
        console.log(`Nuevo objeto en olimpic: <${JSON.stringify(newOlimpic,null,2)}>`);
        db.find({$and: [{city: newOlimpic.city}, {year: newOlimpic.year}]}, (err, olimpicInDB)=>{
		if(err){
			console.error("ERROR accessing 	DB in POST");
			res.sendStatus(500);
		}
		else{
			if(olimpicInDB.length==0){
				if (!newOlimpic.city
                        || !newOlimpic.year
                        || !newOlimpic.gold_medal
                        || !newOlimpic.silver_medal
                        || !newOlimpic.bronze_medal
                        || Object.keys(newOlimpic).length != 5
						|| hasNumbers(newOlimpic.city)){

                        res.sendStatus(400);
                    } else {
                        console.log("Inserting new contact in DB: "+ JSON.stringify(newOlimpic, null,2));
						db.insert(newOlimpic);
						res.sendStatus(201); //CREATED
                    }
				
			}else{
				console.log();
				res.sendStatus(409); //CONFLICT
			}
		}
        });
       
    });
    
    app.delete(BASE_API_PATH+"/:city/:year", (req,res)=>{
        var cityD = req.params.city;
		var yearD =  parseInt(req.params.year);
		db.remove({ $and: [{ city: cityD}, {year: yearD }] }, {}, (err, numOlimpicRemoved)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
			res.sendStatus(500);
		}else{
			
			if(numOlimpicRemoved==0){
				console.error("No data found");
				res.sendStatus(404);
			}else{
				console.log(`stat with city: <${cityD}> and year: <${yearD}> deleted`);
				res.sendStatus(200);
			}
		}
	});
    });
    
    
    
    app.put(BASE_API_PATH+"/:city/:year",(req,res)=>{
        var cityD = req.params.city;
		var yearD =  parseInt(req.params.year);
		var update = req.body;
		if (!update.city
            || !update.year
            || Object.keys(update).length != 5) {

            console.log("Invalid field update")
            res.sendStatus(409);
        } else {
		db.update({city: cityD, year: yearD}, {$set: {city: update.city, year: update.year,  gold_medal: update.gold_medal, silver_medal: update.silver_medal, bronze_medal: update.bronze_medal}}, {},(err, updateOlimpic) => {
				if (err) {
					console.error("ERROR accesing DB in PUT");
					res.sendStatus(500);
				}else{
					if (updateOlimpic == 0) {
                        console.error("No data found");
                        res.sendStatus(404);
                    } else {
                        console.log("Updated fields")
                        res.sendStatus(200);
                    }
				}
			
			});
		}
    });
    
    app.post(BASE_API_PATH+"/:city/:year", (req,res)=>{
    
        res.sendStatus(405);
    });
    
    app.put(BASE_API_PATH, (req,res)=>{
    
        res.sendStatus(405);
    });
    app.delete(BASE_API_PATH, (req,res)=>{
        db.remove({}, {multi:true}, (err, numOlimpicRemoved)=>{
		if (err){
			console.error("ERROR deleting DB contacts in DELETE: "+err);
			res.sendStatus(500);
		}else{
			if(numOlimpicRemoved==0){
				console.error("ERROR olimpic-stats not found");
				res.sendStatus(404);
			}else{
				res.sendStatus(200);
			}
		}
			
	});
    });



 };