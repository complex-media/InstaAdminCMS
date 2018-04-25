var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('./resource');

//Discriminator named Component used.
var resourceComponent = resource.discriminator('Componentr', new mongoose.Schema({
},{ id: true,toObject:true,toJson:true }));

module.exports = resourceComponent;