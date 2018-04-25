console.log('Seeder env:',process.env.NODE_ENV);

require('./config/database.js');

var mongoose = require('mongoose');
var usersSeeds = require('./seeder-users.js');
var aclSeeds = require('./seeder-acl.js');

mongoose.connection.on('connected', function (ref) {
   usersSeeds.addUserfn(aclSeeds.buildNewPermissions);
});
mongoose.connection.on('error', function(){
	console.error.bind(console, 'connection error:');
	console.log('Seeder Failed.');
	process.exit();
	
});
