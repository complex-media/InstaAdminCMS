var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var markdown = element.discriminator('Markdown', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.String
    }
},{ id: true,toObject:true,toJson:true }));

markdown.form = {
	enable:true,
	default:{
		name: '',
		fieldName: ''}
};

module.exports = markdown;