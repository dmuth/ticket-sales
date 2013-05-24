
var log = require("../util/log.js");


/**
* Our new() function so a new event can be created.
*/
exports.new = function(data) {
	retval = new obj(data);
	return(retval);
}

/**
* Our constructor.
*/
var obj = function(data) {
	this.data = data;
	this.calcNumSeats();
	log.info("Venue created. In real life, we'd read event data from the database.");
}


//
// How many seats are available
//
obj.num_seats;


/**
* Calculate the number of available seats.
*/
obj.prototype.calcNumSeats = function() {

	this.num_seats = 0;

	var data = this.data;
	for (var k in data.sections) {
		var section = data.sections[k];
		for (var j in section) {
			var row = section[j];
			for (var i in row) {
				var seat = row[i];
				if (seat.status == "available") {
					this.num_seats++;
				}
			}
		}
	}

} // End of calcNumSeats()


/**
* Get our number of available seats.
*/
obj.prototype.getNumSeats = function() {

	return(this.num_seats);

} // End of getNumSeats()


/**
* Determine if a specific seat is available.
* @param {string} section
* @param {string} row
* @param {string} seat
*
* @return {boolean} Is the seat available?
*/
obj.prototype.checkSeat = function(section, row, seat) {

	//
	// For safety. Better to deny seats than oversell.
	// See also: Star Trek "Riot Con"
	//
	retval = false;

	data = this.data.sections;
	if (data[section]
		&& data[section][row]
		&& data[section][row][seat]) {
		if (data[section][row][seat].status == "available") {
			retval = true;
		}

	} else {
		log.warn(
			"checkSeat(): Seat not found: '" 
			+ section + ":" + row + ":" + seat 
			+ "'! This may be cause for concern.");

	}

	return(retval);

} // End of checkSeat()


/**
* Try to lock a specific seat.
* 
* @param {string} section
* @param {string} row
* @param {string} seat
* @param {integer} optional - How many seconds to lock the seat for?
*
* @return {boolean} Was the seat locked successfully?
*/
obj.prototype.lockSeat = function(section, row, seat, ttl) {

	//
	// For safety. Better to deny seats than oversell.
	// See also: Star Trek "Riot Con"
	//
	retval = false;

	if (!ttl) {
		ttl = 600;
	}

	data = this.data.sections;
	if (data[section]
		&& data[section][row]
		&& data[section][row][seat]) {
		if (data[section][row][seat].status == "available") {
			data[section][row][seat].status = "locked"
			data[section][row][seat].expires = (new Date().getTime() / 1000) + ttl;
			this.num_seats--;
			retval = true;
			log.info("Locked seat: " + section + ":" + row + ":" + seat);
		}

	} else {
		log.warn(
			"lockSeat(): Seat not available: '" 
			+ section + ":" + row + ":" + seat 
			+ "'! This may be cause for concern.");

	}

	return(retval);

} // End of lockSeat()


/**
* Try to unlock a specific seat.
* 
* @param {string} section
* @param {string} row
* @param {string} seat
*
* @return {boolean} Was the seat unlocked successfully?
*/
obj.prototype.unlockSeat = function(section, row, seat) {

	//
	// For safety. Better to deny seats than oversell.
	// See also: Star Trek "Riot Con"
	//
	retval = false;

	data = this.data.sections;
	if (data[section]
		&& data[section][row]
		&& data[section][row][seat]) {
		if (data[section][row][seat].status == "locked") {
			data[section][row][seat].status = "available";
			delete data[section][row][seat].expires;
			this.num_seats++;
			retval = true;
			log.info("Unlocked seat: " + section + ":" + row + ":" + seat);
		}

	} else {
		log.warn(
			"lockSeat(): Seat not available: '" 
			+ section + ":" + row + ":" + seat 
			+ "'! This may be cause for concern.");

	}

	return(retval);

} // End of unlockSeat()


/**
* Claim a seat which has been sold.
* 
* @param {string} section
* @param {string} row
* @param {string} seat
*
* @return {boolean} Was the seat claimed successfully?
*/
obj.prototype.claimSeat = function(section, row, seat) {

	//
	// For safety. Better to deny seats than oversell.
	// See also: Star Trek "Riot Con"
	//
	retval = false;

	data = this.data.sections;
	if (data[section]
		&& data[section][row]
		&& data[section][row][seat]) {
		if (data[section][row][seat].status == "locked") {
			data[section][row][seat].status = "sold";
			delete data[section][row][seat].expires;
			retval = true;
			log.info("Claimed seat: " + section + ":" + row + ":" + seat);
			log.info("In real life, we'd send an SQS event so a reader process can update the database.");
		}

	} else {
		log.warn(
			"claimSeat(): Seat not available: '" 
			+ section + ":" + row + ":" + seat 
			+ "'! Was it locked first?");

	}

	return(retval);

} // End of lockSeat()


/**
* Unlock all locked seats.
*
* This function should never be called directly, but instead called
* peridocally by setTimeout() and friends.
*/
obj.prototype.unlockSeats = function unLockSeats() {

	var data = this.data;
	var date = new Date().getTime() / 1000;

	for (var k in data.sections) {
		var section = data.sections[k];
		for (var j in section) {
			var row = section[j];
			for (var i in row) {
				var seat = row[i];
				if (seat.expires && seat.expires <= date) {
					this.unlockSeat(k, j, i);
					log.info("Unlocked stale lock on seat " 
						+ k + ":" + j + ":" + i);
				}
			}
		}
	}

} // End of unLockSeats()



