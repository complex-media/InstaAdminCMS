// Bring Mongoose into the app
var mongoose = require('mongoose');
var config = require('../config/index.js');
var acl = require('acl');

// Build the connection string
var dbURI = process.env.MONGO_URI || config.mongoUri;
var options = {
  server: {
    socketOptions: {
      keepAlive: 30000,
      connectTimeoutMS: 30000
    }},
  replset: {
      socketOptions: {
        keepAlive: 30000,
        connectTimeoutMS: 30000
      }}};

// Create the database connection
mongoose.connect(dbURI, options);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function() {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function(err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose connection disconnected.App Termination');
    process.exit(0);
  });
});
