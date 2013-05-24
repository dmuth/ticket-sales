/**
* This is our monitor module.
* It will be responsible for executing periodic tasks.
* In the future, it might be used to send metrics off to Splunk or something.
*/


var log = require("../util/log");
var util = require("util");


/**
* Main entry point.
* 
* @param {object} event Our event object
*/
exports.go = function(event) {

	unlockSeats(event);

} // End of go()


/**
* Unlock our seats. When done, schedule ourselves to be called again.
*/
function unlockSeats(event) {

	var delay = 1000 * 1;
	//var delay = 50; // Debugging

	log.info("unlockSeats(): Woke up, unlocking seats.");
	event.unlockSeats();

	log.info(util.format("unlockSeats(): All done! Sleeping for %d seconds...",
		delay / 1000));
	setTimeout(function() {
		unlockSeats(event);
		}, delay);

}



