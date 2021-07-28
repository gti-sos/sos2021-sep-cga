var express = require("express");
var router = express.Router();

//Sacamos el paquete nedb, el paquete de la base de datos
var Datastore=require("nedb");

var db_medal=new Datastore({filename: './medalsdb'});
    db_medal.loadDatabase(function (err) { //La llamada de vuelta, que es opcional
        //Ahora los comandos serán ejecutados
    });

var rio_medal = [];

var d_g = [
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

//5.2: loadInitialData
router.get("/loadInitialData", (req,res) =>{
    db_medal.insert(d_g);
    console.log(`Datos anadidos: <${JSON.stringify(d_g,null,2)}>`);
    res.sendStatus(201); //Created
});


//6.1: Get->Devuelve una lista de recursos

/*router.get("/",(req,res)=>{
		console.log(`Queremos solicitar datos de los abandonos`);
		return res.send(JSON.stringify(db_medal,null,2));
});*/

router.get("/medals",(req,res)=>{

	var selectedMedals = [];
	
	db_medal.find({},(err, medalsFound)=> {
		if(err) {
			console.error("ERROR accesing to the DB in GET" + err);
			res.sendStatus(500); // INTERNAL ERROR. F06.6
		} else {

			// Check if we want to search an specific budget or if we want all of them.
			// In case of no filtering has been declared, all budgets will be sended. SEARCHS
			if(Object.keys(req.query).length == 0) {
				selectedMedals = medalsFound;

				// PAGINATION F06.3
			} else if(req.query.limit != undefined || req.query.offset != undefined) {
				selectedMedals = paginationMaker(req, medalsFound);
			}
			  else {
				selectedMedals = filterOfRequest(req, medalsFound);
			}

			// Get off the id.
			selectedMedals.forEach((t)=>{
				delete t._id;
			});

			if(selectedMedals.includes("ERROR")) {
				res.sendStatus(400); // BAD REQUEST, the values of limit and offset are wrong. F06.6
			} else if(selectedMedals.length == 0) {
				console.error('No surrender has been found');
				res.sendStatus(404); // NOT FOUND F06.6
			}
			else {
				// RETURNS AN ARRAY F06.11
				console.log(`Es array?: <${Array.isArray(selectedMedals)}>`);
				res.status(200).send(JSON.stringify(selectedMedals,null,2)); //OK F06.6
			}
		}
	});
});

// Search method F06.2
function filterOfRequest(req, medals) {
	var res = [];

	for(var medal of medals) {
	var check = true;

	// We mus check for each budget wich field is selected to comparate, if selected,
	// the metod will check if the value of the budget on that field matches with the value on query.

	/*
	"country": "Germany",
    "player": 422,
    "sports": 27,
    "gold_medal": 17,
    "silver_medal":10,
    "bronze_medal": 15
	*/

	if(req.query.country != undefined) {
		if(medal.country != req.query.country)  {
			check = false;
		}
	}
	if(req.query.player != undefined) {
		if(medal.player != req.query.player)  {
			check = false;
		}
	}
	if(req.query.sports != undefined) {
		if(medal.sports != req.query.sports)  {
			check = false;
		}
	}
	if(req.query.gold_medal != undefined) {
		if(medal.gold_medal != req.query.gold_medal)  {
			check = false;
		}
	}
	if(req.query.silver_medal != undefined) {
		if(medal.silver_medal != req.query.silver_medal)  {
			check = false;
		}
	}
	if(req.query.bronze_medal != undefined) {
		if(medal.bronze_medal != req.query.bronze_medal)  {
			check = false;
		}
	}

	if(check) {
		res.push(medal);
	}
	
	}
	return res;

    /*
        "country": "Germany",
    	"player": 422,
    	"sports": 27,
    	"gold_medal": 17,
    	"silver_medal":10,
    	"bronze_medal": 15
    */
}

// Pagination method F06.3
function paginationMaker(req, medals) {
	var res = [];
	const offset = req.query.offset;
	const limit = req.query.limit;

	if(limit < 1 || offset < 0 || offset > medals.length) {
		console.error(`Error in pagination, you have exceded limits`);
		res.push("ERROR");
		return res;	
	}
	const startIndex = offset;
	const endIndex = startIndex + limit;

	res = medals.slice(startIndex, endIndex);
	return res;
}

// POST TO RESOURCES LIST F04.1
router.post("/medals", function(req,res){
	var newMedal = req.body;

	// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
	// HOPED. F06.12
	if(!isValidData(newMedal)) {
		console.error("ERROR incorrect structure of entry data in POST");
		res.sendStatus(400); // BAD REQUEST F06.6
	} else {
		console.log(`Element (surrender) to be inserted: <${JSON.stringify(newMedal,null,2)}>`);

		db_medal.find({country: newMedal.country},(err, medalsFound)=> {
			if(err) {
				console.error("ERROR accesing to the DB in POST" + err);
				res.sendStatus(500); // INTERNAL ERROR F06.6
			} else {

				if (medalsFound.length == 0) {
					console.log("New budget (this budget) can be inserted to the DB... inserting"
					+ JSON.stringify(medalsFound,null,2));
					db_medal.insert(newMedal);
					console.log("New budget (this budget) inserted");
					res.sendStatus(201); // CREATED F06.6
				} else {
					console.log("The budget already exists in the DB... Check conflicts");
					res.sendStatus(409); // CONFLICT F06.6
				}
			}
		});
	}
});

// GET TO A RESOURCE F04.3
router.get("/medals/:player/:sports", function(req,res){
	var Rplayer = parseInt(req.params.player);
	var Rsports = parseInt(req.params.sports);

	console.log(`Searching for the budget with center <${Rplayer}> and year <${Rsports}>`);

	// With both of the identificators F06.10
	db_medal.find({$and: [{degree: Rplayer}, {year: Rsports}]},{},(err, medalsFound)=> {
		if(err) {
			console.error("ERROR accesing to the DB in GET TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(medalsFound.length == 0) {
				console.error('Any data has been found');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				// Get off the id.
				medalsFound.forEach((t)=>{
					delete t._id;
				});
				// RETURNS AN OBJECT, IN THIS CASE, THE ONLY OBJECT ON THE ARRAY F06.11
				console.log(`Found the budget with center <${Rplayer}> and year <${Rsports}> type: <${typeof medalsFound[0]}>`);
				res.status(200).send(JSON.stringify(medalsFound[0],null,2)); //OK F06.6 
			}
		}
	});
});

// DELETE TO A RESOURCE F04.4
router.delete("/medals/:player/:sports", (req,res)=>{
	var Dplayer = parseInt(req.params.player);
	var Dsport = parseInt(req.params.sports);

	console.log(`Deleting the budget with center <${Dplayer}> and year <${Dsport}>...`);

	// With both of the identificators F06.10
	db_medal.remove({$and: [{degree: Dplayer}, {year: Dsport}]},(err, numMedalsRemoved)=>{
		if(err) {
			console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(numMedalsRemoved == 0) {
				console.error('Any data has been deleted');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				console.log(`The budget with center <${Dplayer}> and year <${Dsport}> has been deleted`)
				res.sendStatus(200); // OK F06.6
			}
		}
	});

});

// PUT TO A RESOURCE F04.5
router.put("/surrenders/:degree/:year", function(req,res){

	var Udegree = req.params.degree;
	var Uyear = parseInt(req.params.year);
	var updatedSurrender = req.body;

	// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
	// HOPED. F06.12
	if(!isValidData(updatedSurrender)) {
		console.error("ERROR incorrect structure of entry data in POST");
		res.sendStatus(400); // BAD REQUEST F06.6
	} else {
		console.log(`Deleting the budget with center <${Udegree}> and year <${Uyear}>...`);

		// With both of the identificators F06.10
         /*
        "degree": "History",
        "year": 2018,
        "surrender_counts": 193,
        "new_students": 533,
        "surrender_percent":36.21,
        "center": "FHISTRY"
    */
		db_medal.update({$and: [{degree: Udegree}, {year: Uyear}]},{
			degree: updatedSurrender.degree,
			year: updatedSurrender.year,
			surrender_counts: updatedSurrender.surrender_counts,
			new_students: updatedSurrender.new_students,
			surrender_percent: updatedSurrender.surrender_percent,
			center: updatedSurrender.center },(err, numSurrendersUpdated)=>{
			

				if(err) {
					console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
					res.sendStatus(500); // INTERNAL ERROR F06.6
				} else {
		
					if(numSurrendersUpdated == 0) {
						console.error('Any data has been updated');
						res.sendStatus(404); // NOT FOUND F06.6
					} else {
						console.log(`The budget with center <${Udegree}> and year <${Uyear}> has been updated`)
						res.sendStatus(200); // OK F06.6
					}
				}
		});
	}
});


// POST TO A RESOURCE F04.6 SHOULD RETURN AN ERROR.
router.post("/surrenders/:degree/:year", function(req,res){
	console.log("ERROR, it´s not allowed to make a post to a resource");
	res.sendStatus(405); // NOT ALLOWED F06.6
});

// PUT TO THE RESOURCES LIST F04.7 SHOULD RETURN AN ERROR.
router.put("/surrenders", function(req,res){
	console.log("ERROR, it´s not allowed to make a put to the resource list");
	res.sendStatus(405); // NOT ALLOWED F06.6
});

// DELETE TO A RESOURCE F04.8
router.delete("/surrenders", (req,res)=>{

	console.log(`Deleting all the budgets...`);

	db_medal.remove({},{multi: true},(err, numMedalsRemoved)=>{
		if(err) {
			console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(numMedalsRemoved == 0) {
				console.error('Any data has been deleted');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				console.log(`All the budgets has been deleted, a total of <${numMedalsRemoved}>`)
				res.sendStatus(200); // OK F06.6
			}
		}
	});
});

// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
// HOPED. F06.12
function isValidData(obj){
    if(!Array.isArray(obj)) return validDataEntry(obj);

    for(let element in obj){
        if(!validDataEntry(obj[element])) return false;
    }

    return true;
}

function validDataEntry(obj){
    if(Object.keys(obj).length !== 6) return false;
    if (!obj["country"]) return false;
	if (!obj.country) return false;
	if (!obj["player"]) return false;
    if (!obj.player) return false;
	if (!obj["sports"]) return false;
    if (!obj.sports) return false;
	if (!obj["gold_medal"]) return false;
    if (!obj.gold_medal) return false;
    if (!obj["silver_medal"]) return false;
	if (!obj.silver_medal) return false;
    if (!obj["bronze_medal"]) return false;
	if (!obj.bronze_medal) return false;
    return true;

     /*
        "country": "Germany",
        "player": 422,
        "sports": 27,
        "gold_medal": 17,
        "silver_medal":10,
        "bronze_medal": 15
    */
}
module.exports = router;