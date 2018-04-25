var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var option = element.discriminator('Option', new mongoose.Schema({
	_id: false,
    options: {
    	type:[Schema.Types.Mixed],
    	required:[true,'Options is a required array!'],
    	validate: {
          validator: function(v) {
          	if(!Array.isArray(v)){return false;}
          	v.forEach(function(option){
          		if(typeof option !== 'string' || typeof option !== 'boolean'||typeof option !== 'number' ){return false;}
          	});

          	return true;
          },
          message: 'Options must be an array of values!'
        }
    },
    value: {
    	type:Schema.Types.String,
    	validate: {
          validator: function(v) {
            var inArray = false;

            for (var i = this.options.length - 1; i >= 0; i--) {
              if (this.options[i] == v) {
                inArray = true;
                break;
              }
            };
            return inArray
          },
          message: 'Value must be in options.'
        }
    }
},{ id: true,toObject:true,toJson:true }));

option.form = {
	enable:true,
	default:{
    name:'',
    fieldName:'',
    options:['Option 1','Option 2','Option 3']}
};

module.exports = option;