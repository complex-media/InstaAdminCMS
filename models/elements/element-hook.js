var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var element = require('./element');


var Hook = element.discriminator('Hook', new mongoose.Schema({
    _id: false,
    value: {
        type:Schema.Types.String
    },
    method: {
        type:Schema.Types.String
    },
    request: {
        type:Schema.Types.String
    },
    header: {
        type:Schema.Types.String
    },
    body: {
        type:Schema.Types.String
    },
    query: {
        type:Schema.Types.String
    },
    description: {
        type:Schema.Types.String
    }
},{ id: true,toObject:true,toJson:true }));

Hook.form = {
  enable:true,
  default:{
    name: '',
    fieldName: '',
    description: 'Hook description',
    method:'GET',
    request:'https://www.example.com',
    header:'{}',
    query:'field1=val1&field2=val2',
    body:'{}',
  }
};

module.exports = Hook;