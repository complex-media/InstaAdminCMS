var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var number = element.discriminator('Number', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.Number
    }
},{ id: true,toObject:true,toJson:true }));

number.form = {
  enable:true,
  default:{
  	name:'',
	fieldName:''}
};

module.exports = number;