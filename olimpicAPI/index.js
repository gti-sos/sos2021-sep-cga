var express = require("express");
var router = express.Router();

//Sacamos el paquete nedb, el paquete de la base de datos
var Datastore=require("nedb");

var db_oli=new Datastore({filename: './olimpicAPI/olimpicdb'});
    db_oli.loadDatabase(function (err) { //La llamada de vuelta, que es opcional
        //Ahora los comandos serán ejecutados
    });

var db_olimpico = [];

var d_oli = [
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

//5.2: loadInitialData
router.get("/loadInitialData", (req,res) =>{
    db_oli.insert(d_oli);
    console.log(`Datos anadidos: <${JSON.stringify(d_oli,null,2)}>`);
    res.sendStatus(201); //Created
});


router.get("/olimpics",(req,res)=>{

	var selectedOlimpics = [];
	
	db_oli.find({},(err, olimpicsFound)=> {
		if(err) {
			console.error("ERROR accesing to the DB in GET" + err);
			res.sendStatus(500); // INTERNAL ERROR. F06.6
		} else {

			// Check if we want to search an specific budget or if we want all of them.
			// In case of no filtering has been declared, all budgets will be sended. SEARCHS
			if(Object.keys(req.query).length == 0) {
				selectedOlimpics = olimpicsFound;

				// PAGINATION F06.3
			} else if(req.query.limit != undefined || req.query.offset != undefined) {
				selectedOlimpics = paginationMaker(req, olimpicsFound);
			}
			  else {
				selectedOlimpics = filterOfRequest(req, olimpicsFound);
			}

			// Get off the id.
			selectedOlimpics.forEach((t)=>{
				delete t._id;
			});

			if(selectedOlimpics.includes("ERROR")) {
				res.sendStatus(400); // BAD REQUEST, the values of limit and offset are wrong. F06.6
			} else if(selectedOlimpics.length == 0) {
				console.error('No olimpic has been found');
				res.sendStatus(404); // NOT FOUND F06.6
			}
			else {
				// RETURNS AN ARRAY F06.11
				console.log(`Es array?: <${Array.isArray(selectedOlimpics)}>`);
				res.status(200).send(JSON.stringify(selectedOlimpics,null,2)); //OK F06.6
			}
		}
	});
});

// Search method F06.2
function filterOfRequest(req, olimpics) {
	var res = [];

	for(var olimpic of olimpics) {
	var check = true;

	// We mus check for each budget wich field is selected to comparate, if selected,
	// the metod will check if the value of the budget on that field matches with the value on query.
	if(req.query.city != undefined) {
		if(olimpic.city != req.query.city)  {
			check = false;
		}
	}
	if(req.query.year != undefined) {
		if(olimpic.year != req.query.year)  {
			check = false;
		}
	}
	if(req.query.players != undefined) {
		if(olimpic.players != req.query.players)  {
			check = false;
		}
	}
	if(req.query.gold_medal != undefined) {
		if(olimpic.gold_medal != req.query.gold_medal)  {
			check = false;
		}
	}
	if(req.query.silver_medal != undefined) {
		if(olimpic.silver_medal != req.query.silver_medal)  {
			check = false;
		}
	}
	if(req.query.bronze_medal != undefined) {
		if(olimpic.bronze_medal != req.query.bronze_medal)  {
			check = false;
		}
	}

	if(check) {
		res.push(olimpic);
	}
	
	}
	return res;

    /*
        "city": "History",
        "year": 2018,
        "players": 193,
        "gold_medal": 533,
        "silver_medal":36.21,
        "bronze_medal": "FHISTRY"
    */
}

// Pagination method F06.3
function paginationMaker(req, olimpics) {
	var res = [];
	const offset = req.query.offset;
	const limit = req.query.limit;

	if(limit < 1 || offset < 0 || offset > olimpics.length) {
		console.error(`Error in pagination, you have exceded limits`);
		res.push("ERROR");
		return res;	
	}
	const startIndex = offset;
	const endIndex = startIndex + limit;

	res = olimpics.slice(startIndex, endIndex);
	return res;
}

// POST TO RESOURCES LIST F04.1
router.post("/olimpics", function(req,res){
	var newOlimpic = req.body;

	// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
	// HOPED. F06.12
	if(!isValidData(newOlimpic)) {
		console.error("ERROR incorrect structure of entry data in POST");
		res.sendStatus(400); // BAD REQUEST F06.6
	} else {
		console.log(`Element (olimpic) to be inserted: <${JSON.stringify(newOlimpic,null,2)}>`);

		db_oli.find({bronze_medal: newOlimpic.bronze_medal},(err, olimpicsFound)=> {
			if(err) {
				console.error("ERROR accesing to the DB in POST" + err);
				res.sendStatus(500); // INTERNAL ERROR F06.6
			} else {

				if (olimpicsFound.length == 0) {
					console.log("New budget (this budget) can be inserted to the DB... inserting"
					+ JSON.stringify(olimpicsFound,null,2));
					db_oli.insert(newOlimpic);
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
router.get("/olimpics/:city/:year", function(req,res){
	var Rcity = req.params.city;
	var Ryear = parseInt(req.params.year);

	console.log(`Searching for the budget with bronze_medal <${Rcity}> and year <${Ryear}>`);

	// With both of the identificators F06.10
	db_oli.find({$and: [{city: Rcity}, {year: Ryear}]},{},(err, olimpicsFound)=> {
		if(err) {
			console.error("ERROR accesing to the DB in GET TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(olimpicsFound.length == 0) {
				console.error('Any data has been found');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				// Get off the id.
				olimpicsFound.forEach((t)=>{
					delete t._id;
				});
				// RETURNS AN OBJECT, IN THIS CASE, THE ONLY OBJECT ON THE ARRAY F06.11
				console.log(`Found the budget with bronze_medal <${Rcity}> and year <${Ryear}> type: <${typeof olimpicsFound[0]}>`);
				res.status(200).send(JSON.stringify(olimpicsFound[0],null,2)); //OK F06.6 
			}
		}
	});
});

// DELETE TO A RESOURCE F04.4
router.delete("/olimpics/:city/:year", (req,res)=>{
	var Dcity = req.params.city;
	var Dyear = parseInt(req.params.year);

	console.log(`Deleting the budget with bronze_medal <${Dcity}> and year <${Dyear}>...`);

	// With both of the identificators F06.10
	db_oli.remove({$and: [{city: Dcity}, {year: Dyear}]},(err, numOlimpicsRemoved)=>{
		if(err) {
			console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(numOlimpicsRemoved == 0) {
				console.error('Any data has been deleted');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				console.log(`The budget with bronze_medal <${Dcity}> and year <${Dyear}> has been deleted`)
				res.sendStatus(200); // OK F06.6
			}
		}
	});

});

// PUT TO A RESOURCE F04.5
router.put("/olimpics/:city/:year", function(req,res){

	var Ucity = req.params.city;
	var Uyear = parseInt(req.params.year);
	var updatedOlimpic = req.body;

	// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
	// HOPED. F06.12
	if(!isValidData(updatedOlimpic)) {
		console.error("ERROR incorrect structure of entry data in POST");
		res.sendStatus(400); // BAD REQUEST F06.6
	} else {
		console.log(`Deleting the budget with bronze_medal <${Ucity}> and year <${Uyear}>...`);

		// With both of the identificators F06.10
         /*
        "city": "History",
        "year": 2018,
        "players": 193,
        "gold_medal": 533,
        "silver_medal":36.21,
        "bronze_medal": "FHISTRY"
    */
		db_oli.update({$and: [{city: Ucity}, {year: Uyear}]},{
			city: updatedOlimpic.city,
			year: updatedOlimpic.year,
			players: updatedOlimpic.players,
			gold_medal: updatedOlimpic.gold_medal,
			silver_medal: updatedOlimpic.silver_medal,
			bronze_medal: updatedOlimpic.bronze_medal },(err, numOlimpicsUpdated)=>{
			

				if(err) {
					console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
					res.sendStatus(500); // INTERNAL ERROR F06.6
				} else {
		
					if(numOlimpicsUpdated == 0) {
						console.error('Any data has been updated');
						res.sendStatus(404); // NOT FOUND F06.6
					} else {
						console.log(`The budget with bronze_medal <${Ucity}> and year <${Uyear}> has been updated`)
						res.sendStatus(200); // OK F06.6
					}
				}
		});
	}
});


// POST TO A RESOURCE F04.6 SHOULD RETURN AN ERROR.
router.post("/olimpics/:city/:year", function(req,res){
	console.log("ERROR, it´s not allowed to make a post to a resource");
	res.sendStatus(405); // NOT ALLOWED F06.6
});

// PUT TO THE RESOURCES LIST F04.7 SHOULD RETURN AN ERROR.
router.put("/olimpics", function(req,res){
	console.log("ERROR, it´s not allowed to make a put to the resource list");
	res.sendStatus(405); // NOT ALLOWED F06.6
});

// DELETE TO A RESOURCE F04.8
router.delete("/olimpics", (req,res)=>{

	console.log(`Deleting all the budgets...`);

	db_oli.remove({},{multi: true},(err, numOlimpicsRemoved)=>{
		if(err) {
			console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(numOlimpicsRemoved == 0) {
				console.error('Any data has been deleted');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				console.log(`All the budgets has been deleted, a total of <${numOlimpicsRemoved}>`)
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
    if (!obj["city"]) return false;
	if (!obj.city) return false;
	if (!obj["year"]) return false;
    if (!obj.year) return false;
	if (!obj["players"]) return false;
    if (!obj.players) return false;
	if (!obj["gold_medal"]) return false;
    if (!obj.gold_medal) return false;
    if (!obj["silver_medal"]) return false;
	if (!obj.silver_medal) return false;
    if (!obj["bronze_medal"]) return false;
	if (!obj.bronze_medal) return false;
    return true;

     /*
        "city": "Pekin",
		"year": 2008,
		"players": 286,
		"gold_medal": 5,
		"silver_medal": 11,
		"bronze_medal": 3,
    */
}
module.exports = router;