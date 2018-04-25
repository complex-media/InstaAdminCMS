var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var moment = require('moment');

// define the schema for our user model
var userSchema = mongoose.Schema({

  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  forgotToken:  {
    token: Schema.Types.String,
    createdAt: Schema.Types.Date
  }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.generateReissue = function() {
  return {
    token:bcrypt.hashSync(Math.floor(Math.random() * (100000000)), bcrypt.genSaltSync(8), null).substring(0, 22).replace('/', 'k').replace('?', 'q'),
    createdAt:moment().format('YYYY-MM-DDTHH:mm:ss')
  }
};

userSchema.methods.expiredReissue = function() {
  return (moment().subtract(3, 'days') > moment(this.forgotToken.createdAt));
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
