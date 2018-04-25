var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');
var moment = require('moment');


var date = element.discriminator('Date', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.Date
    }
},{ id: true,toObject:true,toJson:true }));


date.form = {
  enable:true,
  default:{
  	name:'',
	fieldName:''}
};

module.exports = date;