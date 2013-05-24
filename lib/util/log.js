
/**
* This module is a wrapper for the log4js module.
* It makes my life easier.
*/

//
// Require our module and grab the object
//
var log4js = require("log4js");
var logger = log4js.getLogger();

//
// Uncomment this to catch ALL messages written to the console.
//
//log4js.replaceConsole()

//
// Set our level fairly high.  It can be changed externally.
//
logger.setLevel("error");


exports.setLevel = function(level) {
	logger.setLevel(level);
}

exports.trace = function(string) {
	logger.trace(string);
}

exports.debug = function(string) {
	logger.debug(string);
}

exports.info = function(string) {
	logger.info(string);
}

exports.warn = function(string) {
	logger.warn(string);
}

exports.error = function(string) {
	logger.error(string);
}


