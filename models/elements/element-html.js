var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var html = element.discriminator('Html', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.String
    }
},{ id: true,toObject:true,toJson:true }));

html.form = {
	enable:true,
	default:{
		name: '',
		fieldName: ''}
};

module.exports = html;