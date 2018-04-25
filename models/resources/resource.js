var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var HookSchema = mongoose.Schema({
  request:{
    type: Schema.Types.String,
    required:[true,'Must be a url endpoint'],
    validate: {
      validator: function(v) { return v.match(new RegExp(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)); },
      message: 'Must be a url'
    },
  },
  method:{
    type: Schema.Types.String,
    required:[true,'Must be GET or POST for now'],
    validate: {
      validator: function(v) { return (v == 'get' || v == 'post');},
      message: 'Must be GET or POST for now'
    },
  },
  responsePath:{
    type: Schema.Types.String,
    required:[true,'Must be dot notation path.'],
    validate: {
      validator: function(v) { return v.match(new RegExp(/^[a-z0-9\-\.]+$/)); },
      message: 'Must be dot notation alphanumeric path.'
    },
  },
  responseType:{
    type: Schema.Types.String,
    required:[true,'Must be Json for now.'],
    validate: {
      validator: function(v) { return (v == 'json');},
      message: 'Must be json'
    },
  },
  regexValue:{
    type: Schema.Types.String,
    required:true,
  }
});

var ResourceSchema = mongoose.Schema({
  title:  Schema.Types.String,
  description:  Schema.Types.String,
  delete: {type: Schema.Types.Boolean,default: false},
  state:  Schema.Types.Number,
  createdAt: Schema.Types.Date ,
  updatedAt: {type: Schema.Types.Date} ,
  createdBy: {type: Schema.ObjectId, ref: 'User'},
  appData: [],
  schemaLock: {type: Schema.Types.Boolean,default: false},
  dataLock: {type: Schema.Types.Boolean,default: false},
  url:  Schema.Types.String,
  hooks:{
    onPublish:HookSchema
  },
  apiKey:Schema.Types.String,
  tags: [Schema.Types.String]
},{id: true,toObject: true,toJson: true});

var Resources = mongoose.model('Resources', ResourceSchema);
module.exports = Resources;
