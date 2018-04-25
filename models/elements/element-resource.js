var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var resource = element.discriminator('Resource', new mongoose.Schema({
	_id: false,
    value: {
    	type:Schema.Types.String
    },
    maxSize:{
    	type:Schema.Types.Number
    },
    sizeUnit:{
      type: Schema.Types.String,
      required:[true,'Must be KB or MB'],
      validate: {
          validator: function(v) {
            if (v != 'KB' || v != 'MB') {
              return false;
            }

            return true;
          },
          message: 'Must be KB or MB'
        }
    },
    versioning:{
      type: Schema.Types.Boolean
    }
},{ id: true,toObject:true,toJson:true }));

resource.uploadValidate = function(){
	return false;
};

resource.form = {
	enable:true,
	default:{
		name: '',
		fieldName: '',
		maxSize: 100,
    versioning: true,
		sizeUnit: 'KB'}
};

module.exports = resource;