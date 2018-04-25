var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var url = element.discriminator('Url', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.String,
    	validate: {
          validator: function(v) {
            return /^(https?:\/\/)?([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})([\/\w\.-]*)*\/?$/.test(v);
          },
          message: '{VALUE} is not a valid url!'
        }
    }
},{ id: true,toObject:true,toJson:true }));

url.form = {
	enable:true,
	default:{
    name:'',
    fieldName:''}
};

module.exports = url;