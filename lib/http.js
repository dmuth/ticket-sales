/**
* This module is used for setting up our webserver.
*/

var express = require('express');
var event = require("./model/event.js");
var log = require("./util/log.js");


//
// Hardcoded data that would normally come from the database.
//
var data = {
	name: "Distant Worlds",
	_comment: "This data structure holds a representation of all seats.",
	sections: {
		orchestra: {
			a: {
				"1": {status: "available"},
				"3": {status: "available"},
				"5": {status: "available"},
				"7": {status: "available"},
				},
			b: {
				"1": {status: "available"},
				"3": {status: "available"},
				"5": {status: "available"},
				"7": {status: "available"},
				},
			c: {
				"1": {status: "available"},
				"3": {status: "available"},
				"5": {status: "available"},
				"7": {status: "available"},
				},
			},
		//
		// I could fill these in later.
		//
		mezzanine: {
			},
		balcony: {
			},
		box: {
			},
		standing: {
			},
		roof: {
			},
	}
	};


//
// In the real world, this would be an array of many events, 
// with the key being the slug name.
//
var eventObj = event.new(data);

//
// Right now, URI handlers are going to be hardcoded for a single event.
// In the real world, I would probably use token substitution in the URL to 
// dynamically load the event if it doesn't already exist.
//
var app = express();

//
// Rather than having all of those code inlined, I'd probably use middleware 
// as an output formatter.
//
// Also, in the real world, I would have more granularity on the error codes 
// (404 for seat not found, 403 for a seat I can't have, 
// 410 for an event which has passed its date, etc.)
//
app.get("/", function(req, res){
	res.send("Welcome!\n");
});


app.get("/seat/check/:section/:row/:seat", function(req, res) {

	var retval = {};
	var data = req.params;

	var response = eventObj.checkSeat(data.section, data.row, data.seat);
	if (response) {
		retval.message = "Seat is available!";
	} else {
		retval.message = "Seat unavailable";
		res.status(404);
	}

	res.send(JSON.stringify(retval, false, 2) + "\n")

});


app.get("/seat/lock/:section/:row/:seat", function(req, res) {

	var retval = {};
	var data = req.params;

	var response = eventObj.lockSeat(data.section, data.row, data.seat);
	if (response) {
		retval.message = "Seat locked successfully!";
	} else {
		retval.message = "Could not lock seat";
		res.status(404);
	}

	res.send(JSON.stringify(retval, false, 2) + "\n")

});


app.get("/seat/unlock/:section/:row/:seat", function(req, res) {

	var retval = {};
	var data = req.params;

	var response = eventObj.lockSeat(data.section, data.row, data.seat);
	if (response) {
		retval.message = "Seat unlocked successfully!";
	} else {
		retval.message = "Could not unlock seat";
		res.status(404);
	}

	res.send(JSON.stringify(retval, false, 2) + "\n")

});


app.get("/seat/claim/:section/:row/:seat", function(req, res) {

	var retval = {};
	var data = req.params;

	var response = eventObj.claimSeat(data.section, data.row, data.seat);
	if (response) {
		retval.message = "Seat claimed successfully. It's all yours!";
	} else {
		retval.message = "Could not claim seat.";
		res.status(404);
	}

	res.send(JSON.stringify(retval, false, 2) + "\n")

});


app.get("/seat/num_available", function(req, res) {

	var retval = {};
	var data = req.params;

	var response = eventObj.getNumSeats();
	retval.num = response;

	res.send(JSON.stringify(retval, false, 2) + "\n")

});


//
// Fire up the webserver
//
var port = 3000;
app.listen(port);
log.info("Webserver listening on port " + port);

//
// Exit cleanly
//
process.on('SIGTERM',function(){
	log.error("SIGTERM received, bailing out!");
	process.exit(1);
});



