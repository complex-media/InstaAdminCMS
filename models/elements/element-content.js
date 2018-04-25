var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var content = element.discriminator('Content', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.String
    },
    maxLength: {
    	type:Schema.Types.Number,
    	validate: {
          validator: function(v) {
          	return typeof v == 'number'; 
          },
          message: 'Must be a number!'
        }
    },
},{ id: true,toObject:true,toJson:true }));

content.form = {
	enable:true,
	default:{
		name: '',
		fieldName: '',
    maxLength:500}
};

module.exports = content;