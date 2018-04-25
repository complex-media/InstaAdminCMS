var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var resource = require('./resource');

var resourceTemplate = resource.discriminator('Template', new mongoose.Schema({
},{ id: true,toObject:true,toJson:true }));

module.exports = resourceTemplate;