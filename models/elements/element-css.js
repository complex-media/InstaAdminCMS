var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var css = element.discriminator('Css', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.String
    }
},{ id: true,toObject:true,toJson:true }));

css.form = {
	enable:true,
	default:{
		name: '',
		fieldName: ''}
};

module.exports = css;