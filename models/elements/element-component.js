var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');

var componentSchema = new mongoose.Schema({
	_id: false,
	isList: {
    	type:Schema.Types.Boolean
    },
    maxSize:{
    	type:Schema.Types.Number
    },
	children: []
},{ id: true,toObject:true,toJson:true });

var component = element.discriminator('Component', componentSchema);

component.form = {
	enable:true,
	default:{
		name:'',
		fieldName:'',
		isList:false,
		maxSize:0
	}
};

module.exports = component;