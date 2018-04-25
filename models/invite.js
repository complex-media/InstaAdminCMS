var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var moment = require('moment');

// define the schema for our user model
var InviteSchema = mongoose.Schema({
  email:  Schema.Types.String,
  role: Schema.Types.String,
  resourceId: Schema.Types.String,
  token:  Schema.Types.String,
  createdAt: {
    type: Schema.Types.Date,
    default: moment().format('YYYY-MM-DDTHH:mm:ss')}
});

// methods ======================
// generating a hash
InviteSchema.methods.generateToken = function() {
  return bcrypt.hashSync(Math.floor(Math.random() * (100000000)), bcrypt.genSaltSync(8), null).substring(0, 22).replace('/', 'k').replace('?', 'q');
};

InviteSchema.methods.expired = function() {
  return (moment().subtract(25, 'days') > moment(this.createdAt));
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Invite', InviteSchema);
