

var seq = require("seq");
var log = require("../../lib/util/log.js");
var should = require("should");
var venue = require("../../lib/model/venue.js");

//
// Our venue object
//
var venueObject;


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


suite("venue", function() {


	/**
	* Set up and populate our venue object before each test.
	*/
	setup(function(done) {
		log.setLevel("debug"); // Debugging
		venueObject = venue.new(data);
		done();
	});


	/**
	* Destroy our venue object after each test.
	*/
	teardown(function(done) {
		delete venueObject;
		done();
	});


	test("test", function(done) {

		var result = venueObject.getNumSeats();
		result.should.equal(12);

		var result = venueObject.checkSeat("orchestra", "a", "3");
		result.should.be.true;
		var result = venueObject.checkSeat("foobar", "a", "3");
		result.should.be.false;

		var result = venueObject.lockSeat("orchestra", "a", "3");
		result.should.be.true;
		var result = venueObject.lockSeat("orchestra", "a", "3");
		result.should.be.false;
		var result = venueObject.lockSeat("orchestra", "foobar", "3");
		result.should.be.false;
		var result = venueObject.getNumSeats();
		result.should.equal(11);

		var result = venueObject.unlockSeat("orchestra", "a", "3");
		result.should.be.true;
		var result = venueObject.unlockSeat("orchestra", "a", "foobar");
		result.should.be.false;
		var result = venueObject.unlockSeat("orchestra", "a", "3");
		result.should.be.false;
		var result = venueObject.getNumSeats();
		result.should.equal(12);

		//
		// Now go through the process of claiming a sold seat
		//
		var result = venueObject.lockSeat("orchestra", "a", "7");
		result.should.be.true;
		var result = venueObject.claimSeat("orchestra", "a", "7");
		result.should.be.true;
		var result = venueObject.checkSeat("orchestra", "a", "7");
		result.should.be.false;
		var result = venueObject.getNumSeats();
		result.should.equal(11);

		//
		// We're going to test unlockSeats(), which will be called 
		// periodically when running as a webserver.
		//
		var result = venueObject.lockSeat("orchestra", "b", "3");
		result.should.be.true;
		var result = venueObject.lockSeat("orchestra", "b", "7");
		result.should.be.true;
		var result = venueObject.getNumSeats();
		result.should.equal(9);
		venueObject.unlockSeats();
		var result = venueObject.getNumSeats();
		result.should.equal(11);

		done();

	});


});



