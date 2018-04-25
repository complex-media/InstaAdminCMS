var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');
var sizeOf = require('image-size');


var image = element.discriminator('Image', new mongoose.Schema({
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
        },
    },
    versioning:{
      type: Schema.Types.Boolean
    },
    allowed: {
    	type:[Schema.Types.String],
    	required:[true,'Allowed is a required array!'],
    	validate: {
          validator: function(v) {
          	if(!Array.isArray(v)){return false;}
          	v.forEach(function(option){
          		if(typeof option !== 'string' || typeof option !== 'boolean'||typeof option !== 'number' ){return false;}
          	});

          	return true;
          },
          message: 'Allowed must be an array of values!'
        }
    },
    maxHeight: {
    	type:Schema.Types.Number,
    	validate: {
          validator: function(v) {
          	return typeof v == 'number'; 
          },
          message: 'Must be a number!'
        }
    },
    maxWidth: {
    	type:Schema.Types.Number,
    	validate: {
          validator: function(v) {
          	return typeof v == 'number'; 
          },
          message: 'Must be a number!'
        }
    },
},{ id: true,toObject:true,toJson:true }));

image.form = {
	enable:true,
	default:{
		name: '',
		fieldName: '',
		maxHeight:null,
		maxWidth:null,
		allowed:['jpg','jpeg','png','gif'],
		maxSize: 3,
    versioning:true,
    sizeUnit:'MB'}
};

image.uploadValidate = function(){
  var config = arguments[0];
  var file = arguments[1];
  var stats = arguments[2];

  var allowed = config.allowed.join("|");
  if (allowed.indexOf('jpg') != -1) 
    allowed += '|jpeg';
  if (allowed.indexOf('jpeg') != -1) 
    allowed += '|jpg';
  if (allowed.indexOf(file.mimetype.replace("image/","")) ==  -1) {
    return 'Invalid format. Only ' + config.allowed.join(', ') + ' allowed.';
  }

  var dimensions = sizeOf(file.path);

  if (typeof config.maxWidth == 'undefined' || !config.maxWidth || config.maxWidth == null || config.maxWidth == 0)
    config.maxWidth = 1000000;
  if (typeof config.maxHeight == 'undefined' || !config.maxHeight || config.maxHeight == null || config.maxHeight == 0)
    config.maxHeight = 1000000;

  if (dimensions.width > config.maxWidth || dimensions.height > config.maxHeight) {
    return 'Invalid dimesions. Image should be no greater than ' + dimensions.width +'px by ' + dimensions.height + 'px.' ;
  }

	return false;
};

module.exports = image;