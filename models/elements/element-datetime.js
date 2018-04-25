var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');
var moment = require('moment');

var datetime = element.discriminator('Datetime', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.Date
    }
},{ id: true,toObject:true,toJson:true }));

datetime.form = {
  enable:true,
  default:{
  	name:'',
	fieldName:''}
};

module.exports = datetime;