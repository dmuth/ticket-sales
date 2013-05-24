

var seq = require("seq");
var log = require("../../lib/util/log.js");
var should = require("should");
var event = require("../../lib/model/event.js");

//
// Our event object
//
var eventObject;


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


suite("event", function() {


	/**
	* Set up and populate our event object before each test.
	*/
	setup(function(done) {
// TEST
		log.setLevel("debug"); // Debugging
		eventObject = event.new(data);
		done();
	});


	/**
	* Destroy our event object after each test.
	*/
	teardown(function(done) {
		delete eventObject;
		done();
	});


	test("test", function(done) {

		var result = eventObject.getNumSeats();
		result.should.equal(12);

		var result = eventObject.checkSeat("orchestra", "a", "3");
		result.should.be.true;
		var result = eventObject.checkSeat("foobar", "a", "3");
		result.should.be.false;

		var result = eventObject.lockSeat("orchestra", "a", "3");
		result.should.be.true;
		var result = eventObject.lockSeat("orchestra", "a", "3");
		result.should.be.false;
		var result = eventObject.lockSeat("orchestra", "foobar", "3");
		result.should.be.false;
		var result = eventObject.getNumSeats();
		result.should.equal(11);

		var result = eventObject.unlockSeat("orchestra", "a", "3");
		result.should.be.true;
		var result = eventObject.unlockSeat("orchestra", "a", "foobar");
		result.should.be.false;
		var result = eventObject.unlockSeat("orchestra", "a", "3");
		result.should.be.false;
		var result = eventObject.getNumSeats();
		result.should.equal(12);

		//
		// Now go through the process of claiming a sold seat
		//
		var result = eventObject.lockSeat("orchestra", "a", "7");
		result.should.be.true;
		var result = eventObject.claimSeat("orchestra", "a", "7");
		result.should.be.true;
		var result = eventObject.checkSeat("orchestra", "a", "7");
		result.should.be.false;
		var result = eventObject.getNumSeats();
		result.should.equal(11);

		//
		// We're going to test unlockSeats(), which will be called 
		// periodically when running as a webserver.
		//
		// Let's set the TTL to the *past*, so that unlockSeats()
		// always works.
		//
		var result = eventObject.lockSeat("orchestra", "b", "3", -100);
		result.should.be.true;
		var result = eventObject.lockSeat("orchestra", "b", "7", -100);
		result.should.be.true;
		var result = eventObject.getNumSeats();
		result.should.equal(9);
		eventObject.unlockSeats();
		var result = eventObject.getNumSeats();
		result.should.equal(11);

		done();

	});


});



