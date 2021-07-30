// Requiere el paquete express
var express = require("express");

// Requiere el paquete nedb, que es el paquete de la base de datos.
var Datastore = require("nedb");

// Inicializamos la base de datos. PERSISTANCE F06.4
var dbRealMadrid = new Datastore({ filename: './realmadridAPI/realmadridDB' });
	dbRealMadrid.loadDatabase(function (err) {    // Callback is optional
  	// Now commands will be executed
});
// Iniciamos el routeador de la app.
var router = express.Router();

// Array de datos Inicales.
var initialData = [
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


// Index page.
router.get("/", (req,res) =>{
    res.send('<html><body><h1> Hi!</h1> <br> <h3> This is the API home page: "REAL MADRID DATA". Please, load <a href="https://sos2021-sep-cga.herokuapp.com/">the initial data</a> to display the information.</h3></body><html>');
    res.sendStatus(200); // OK
});

// Charge the initial data.
router.get("/realmadridAPI/loadInitialData", (req,res) =>{
	dbRealMadrid.insert(initialData);
    console.log(`Data added: <${JSON.stringify(initialData,null,2)}>`);
    res.sendStatus(201); // CREATED
});

////////////////////// MAIN CODE ////////////////////////////

// SEARCHS F06.2 | RETURNS A LIST WITH ALL RESOURCES F04.1
// Return a specific budget or all budgets as the query deteminates.
router.get("/realmadridAPI",(req,res)=>{

	var selectedRM = [];
	
	dbRealMadrid.find({},(err, RMFound)=> {
		if(err) {
			console.error("ERROR accesing to the DB in GET" + err);
			res.sendStatus(500); // INTERNAL ERROR. F06.6
		} else {

			// Check if we want to search an specific budget or if we want all of them.
			// In case of no filtering has been declared, all budgets will be sended. SEARCHS
			if(Object.keys(req.query).length == 0) {
				selectedRM = RMFound;

				// PAGINATION F06.3
			} else if(req.query.limit != undefined || req.query.offset != undefined) {
				selectedRM = paginationMaker(req, RMFound);
			}
			  else {
				selectedRM = filterOfRequest(req, RMFound);
			}

			// Get off the id.
			selectedRM.forEach((t)=>{
				delete t._id;
			});

			if(selectedRM.includes("ERROR")) {
				res.sendStatus(400); // BAD REQUEST, the values of limit and offset are wrong. F06.6
			} else if(selectedRM.length == 0) {
				console.error('Any budget has been found');
				res.sendStatus(404); // NOT FOUND F06.6
			}
			else {
				// RETURNS AN ARRAY F06.11
				console.log(`Es array?: <${Array.isArray(selectedRM)}>`);
				res.status(200).send(JSON.stringify(selectedR,null,2)); //OK F06.6
			}
		}
	});
});

// Search method F06.2
function filterOfRequest(req, realmadrids) {
	var res = [];

	for(var realmadrid of realmadrids) {
	var check = true;

	// We mus check for each budget wich field is selected to comparate, if selected,
	// the metod will check if the value of the budget on that field matches with the value on query.
	if(req.query.competition != undefined) {
		if(realmadrid.competition != req.query.competition)  {
			check = false;
		}
	}
	if(req.query.year != undefined) {
		if(realmadrid.year != req.query.year)  {
			check = false;
		}
	}
	if(req.query.points != undefined) {
		if(realmadrid.points != req.query.points)  {
			check = false;
		}
	}
	if(req.query.goal_score != undefined) {
		if(realmadrid.goal_score != req.query.goal_score)  {
			check = false;
		}
	}
	if(req.query.win_games != undefined) {
		if(realmadrid.win_games != req.query.win_games)  {
			check = false;
		}
	}
	if(req.query.classification != undefined) {
		if(realmadrid.classification != req.query.classification)  {
			check = false;
		}
	}

	if(check) {
		res.push(realmadrids);
	}
	
	}
	return res;
}

// Pagination method F06.3
function paginationMaker(req, realmadrids) {
	var res = [];
	const offset = req.query.offset;
	const limit = req.query.limit;

	if(limit < 1 || offset < 0 || offset > realmadrids.length) {
		console.error(`Error in pagination, you have exceded limits`);
		res.push("ERROR");
		return res;	
	}
	const startIndex = offset;
	const endIndex = startIndex + limit;

	res = realmadrids.slice(startIndex, endIndex);
	return res;
}

// POST TO RESOURCES LIST F04.1
router.post("/realmadridAPI", function(req,res){
	var newRealmadrid = req.body;

	// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
	// HOPED. F06.12
	if(!isValidData(newRealmadrid)) {
		console.error("ERROR incorrect structure of entry data in POST");
		res.sendStatus(400); // BAD REQUEST F06.6
	} else {
		console.log(`Element (budget) to be inserted: <${JSON.stringify(newRealmadrid,null,2)}>`);

		dbRealMadrid.find({competition: newRealmadrid.competition},(err, RMFound)=> {
			if(err) {
				console.error("ERROR accesing to the DB in POST" + err);
				res.sendStatus(500); // INTERNAL ERROR F06.6
			} else {

				if (RMFound.length == 0) {
					console.log("New budget (this budget) can be inserted to the DB... inserting"
					+ JSON.stringify(RMFound,null,2));
					dbRealMadrid.insert(newRealmadrid);
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
router.get("/realmadridAPI/:competition/:year", function(req,res){
	var Rcompetition = req.params.competition;
	var Ryear = parseInt(req.params.year);

	console.log(`Searching for the budget with competition <${Rcompetition}> and year <${Ryear}>`);

	// With both of the identificators F06.10
	dbRealMadrid.find({$and: [{competition: Rcompetition}, {year: Ryear}]},{},(err, RMFound)=> {
		if(err) {
			console.error("ERROR accesing to the DB in GET TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(RMFound.length == 0) {
				console.error('Any data has been found');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				// Get off the id.
				RMFound.forEach((t)=>{
					delete t._id;
				});
				// RETURNS AN OBJECT, IN THIS CASE, THE ONLY OBJECT ON THE ARRAY F06.11
				console.log(`Found the budget with competition <${Rcompetition}> and year <${Ryear}> type: <${typeof RMFound[0]}>`);
				res.status(200).send(JSON.stringify(RMFound[0],null,2)); //OK F06.6 
			}
		}
	});
});

// DELETE TO A RESOURCE F04.4
router.delete("/realmadridAPI/:competition/:year", (req,res)=>{
	var Dcompetition = req.params.competition;
	var Dyear = parseInt(req.params.year);

	console.log(`Deleting the budget with competition <${Dcompetition}> and year <${Dyear}>...`);

	// With both of the identificators F06.10
	dbRealMadrid.remove({$and: [{competition: Dcompetition}, {year: Dyear}]},(err, numRealMadridRemoved)=>{
		if(err) {
			console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(numRealMadridRemoved == 0) {
				console.error('Any data has been deleted');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				console.log(`The budget with competition <${Dcompetition}> and year <${Dyear}> has been deleted`)
				res.sendStatus(200); // OK F06.6
			}
		}
	});

});

// PUT TO A RESOURCE F04.5
router.put("/realmadridAPI/:competition/:year", function(req,res){

	var Ucompetition = req.params.competition;
	var Uyear = parseInt(req.params.year);
	var updatedRealMadrid = req.body;

	// WE SHOULD RETURN A 400 CODE WHEN WE DONT RECEIVE A JSON DATA WITH THE EXACTLY DATA STRUCTURE
	// HOPED. F06.12
	if(!isValidData(updatedRealMadrid)) {
		console.error("ERROR incorrect structure of entry data in POST");
		res.sendStatus(400); // BAD REQUEST F06.6
	} else {
		console.log(`Deleting the budget with competition <${Ucompetition}> and year <${Uyear}>...`);

		// With both of the identificators F06.10
		dbRealMadrid.update({$and: [{competition: Ucompetition}, {year: Uyear}]},{
			competition: updatedRealMadrid.competition,
			year: updatedRealMadrid.year,
			points: updatedRealMadrid.points,
			goal_score: updatedRealMadrid.goal_score,
			win_games: updatedRealMadrid.win_games,
			classification: updatedRealMadrid.classification },(err, numRealMadridUpdated)=>{
			

				if(err) {
					console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
					res.sendStatus(500); // INTERNAL ERROR F06.6
				} else {
		
					if(numRealMadridUpdated == 0) {
						console.error('Any data has been updated');
						res.sendStatus(404); // NOT FOUND F06.6
					} else {
						console.log(`The budget with competition <${Ucompetition}> and year <${Uyear}> has been updated`)
						res.sendStatus(200); // OK F06.6
					}
				}
		});
	}
});

// POST TO A RESOURCE F04.6 SHOULD RETURN AN ERROR.
router.post("/realmadridAPI/:competition/:year", function(req,res){
	console.log("ERROR, it´s not allowed to make a post to a resource");
	res.sendStatus(405); // NOT ALLOWED F06.6
});

// PUT TO THE RESOURCES LIST F04.7 SHOULD RETURN AN ERROR.
router.put("/realmadridAPI", function(req,res){
	console.log("ERROR, it´s not allowed to make a put to the resource list");
	res.sendStatus(405); // NOT ALLOWED F06.6
});

// DELETE TO A RESOURCE F04.8
router.delete("/realmadridAPI", (req,res)=>{

	console.log(`Deleting all the budgets...`);

	dbRealMadrid.remove({},{multi: true},(err, numRealMadridRemoved)=>{
		if(err) {
			console.error("ERROR accesing to the DB in DELETE TO A RESOURCE" + err);
			res.sendStatus(500); // INTERNAL ERROR F06.6
		} else {

			if(numRealMadridRemoved == 0) {
				console.error('Any data has been deleted');
				res.sendStatus(404); // NOT FOUND F06.6
			} else {
				console.log(`All the budgets has been deleted, a classification of <${numRealMadridRemoved}>`)
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
    if (!obj["competition"]) return false;
    if (!obj["year"]) return false;
    if (!obj["points"]) return false;
    if (!obj["goal_score"]) return false;
    if (!obj["win_games"]) return false;
    if (!obj["classification"]) return false;
    return true;
}

module.exports = router;