var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('./resource');

var resourceApp = resource.discriminator('App', new mongoose.Schema({
},{ id: true,toObject:true,toJson:true }));

module.exports = resourceApp;