var config = require('../config/index.js');

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User            = require('../models/user');
var Invite            = require('../models/invite');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    // asynchronous
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {

      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      Invite.findOne({'email': email,'token': req.body.token}, function(err, invite) {
        if (err)
          return done(err);

        var newUser            = new User();

        // set the user's local credentials
        newUser.local.email    = email;
        newUser.local.password = newUser.generateHash(password);

        // save the user
        newUser.save(function(err, user) {
          if (err)
            throw err;
          var role = [];
          if (typeof invite.resourceId != 'undefined') {
            role = ['user',invite.role + '-' + invite.resourceId];
          } else {
            role = [invite.role];
          }
          req._acl.addUserRoles(user._id.toString() + '-' + user.local.email, role, function() {
            invite.remove();
            return done(null, newUser);
          });
        });

      });
    });

  }));

  passport.use(new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    User.findOne({'local.email': email}, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message: 'Incorrect username.',username:null});
      }
      if (!user.validPassword(password)) {
        return done(null, false, {message: 'Incorrect password.',username:email});
      }
      return done(null, user);
    });
  }
  ));

  passport.use('google-signup', new GoogleStrategy({
    clientID: config.GOOGLE_AUTH_CLIENTID,
    clientSecret: config.GOOGLE_AUTH_CLIENTSECRET,
    callbackURL: config.adminUrl + '/auth/signup/oauth/callback',
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      var inviteHash = JSON.parse(req.query.state).token;
      if (profile.emails[0].value.indexOf('@example.com') == -1)
        return done(null, false, {message: 'Must be a example email account.'});

      Invite.findOne({'token': inviteHash}, function(err, invite) {
        if (err)
          return done(null, false, {message: 'Could not find invitation in our records.'});

        var newUser            = new User();

        // set the user's local credentials
        newUser.local.email    = invite.email;
        newUser.local.password = newUser.generateHash('exampleGoogleAuthUser');
        newUser.google.id = profile.id;
        newUser.google.token = accessToken;
        newUser.google.email = profile.emails[0].value;
        newUser.google.name = profile.displayName;

        // save the user
        newUser.save(function(err, user) {
          if (err)
            return done(null, false, {message: 'Could not save this account to our records.'});

          var role = [];
          if (typeof invite.resourceId != 'undefined') {
            role = ['user',invite.role + '-' + invite.resourceId];
          } else {
            role = [invite.role];
          }
          req._acl.addUserRoles(user._id.toString() + '-' + user.local.email, role, function() {
            invite.remove();
            return done(null, newUser);
          });
        });

      });

    });
  }));

  passport.use('google-add', new GoogleStrategy({
    clientID: config.GOOGLE_AUTH_CLIENTID,
    clientSecret: config.GOOGLE_AUTH_CLIENTSECRET,
    callbackURL: config.adminUrl + '/auth/me/oauth/callback',
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {

    process.nextTick(function() {
      if (profile.emails[0].value.indexOf('@example.com') == -1)
        return done(null, false, {message: 'Must be a example email account.'});
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      var oauthData = {
        'google.id': profile.id,
        'google.token': accessToken,
        'google.email': profile.emails[0].value,
        'google.name': profile.displayName
      };
      User.findOneAndUpdate({'local.email': req.user.local.email}, {'$set': oauthData}, {'upsert': true}, function(err, user) {
        if (err) { return done(err); }
        return done(null, user);
      });

    });
  }));

  passport.use(new GoogleStrategy({
      clientID: config.GOOGLE_AUTH_CLIENTID,
      clientSecret: config.GOOGLE_AUTH_CLIENTSECRET,
      callbackURL: config.adminUrl + '/auth/login/callback'
    }, function(accessToken, refreshToken, profile, done) {
      var userlook = {'google.id': profile.id, 'google.email': profile.emails[0].value};
      User.findOne(userlook, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, {message: 'No user found with this google account.'});
        }

        return done(null, user);
      });
    }
  ));
};
