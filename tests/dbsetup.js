// Bring Mongoose into the app 
var mongoose = require( 'mongoose' ); 
var config = require('../config/test.json');
var fixtures = require('../tests/fixtures.js');


// Build the connection string 
var dbURI = config.mongoUri; 

// Create the database connection 
mongoose.connect(dbURI); 

// If the Node process ends, close the Mongoose connection 
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

exports.drop = function(next) {
 	mongoose.connection.collections['resources'].drop( function(err) {
	    if(err && err.message != 'ns not found'){
	    	console.log(err);
	    }
	    next();
	});
}

exports.fixtures = function(next) {
	mongoose.connection.collections['resources'].insert(fixtures.collections.resources, function(err) {
	    if(err){
	    	console.log(err);
	    }
	    next();
	});
}

