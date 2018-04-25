var express = require('express');
var router = express.Router();
var Invite = require('../models/invite.js');
var User = require('../models/user.js');
var email = require('../services/emailService.js');
var ejs = require('ejs');
var fs = require('fs');
var moment = require('moment');
var config = require('../config/index.js');
var aclMiddleWare = require('../middlewares/aclMiddleWare.js');
var mongoose = require('mongoose');
var Q = require('q');

module.exports = function(passport) {

  router.get('/login', function(req, res) {
    res.render('authentication/login.ejs',{message:null,username:null});
  });

  router.post('/invite', aclMiddleWare() , function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (!req.isAuthenticated()) {
      return res.send({status: 'err',response: 'Need to be logged in.'});
    }

    if (typeof req.body.email == 'undefined' || typeof req.body.role == 'undefined') {
      return res.send({status: 'err',response: 'Requires email and role type.'});
    }

    User.findOne({'local.email': req.body.email}, function(err, user) {
      if (user) {
        return res.send({status: 'err',response: 'User ' + req.body.email + ' already exists'});
      }

      Invite.findOne({'email': req.body.email}, function(err, invite) {
        if (invite) {
          invite.createdAt = moment().format('YYYY-MM-DDTHH:mm:ss');
          invite.save(function(err, updatedInvite) {
            if (err) {
              return res.send({status: 'err',response: 'Invite to ' + req.body.email + ' already exists and could not be renewed.'});
            } else {
              return res.send({status: 'ok',response: 'Invite to ' + req.body.email + ' renewed.'});
            }
          });
        } else {
          var newInvite   = new Invite();
          newInvite.email  = req.body.email;
          newInvite.token = newInvite.generateToken();
          newInvite.role = req.body.role;
          if (typeof req.body.resourceId != 'undefined') {
            newInvite.resourceId = req.body.resourceId;
          }

          // save the user
          newInvite.save(function(err) {
            if (err) {
              return res.send({status: 'err',response: 'Could not create invitation.'});
            }

            var data = {
              role: req.body.role,
              inviteLink: config.adminUrl + '/auth/signup/' + newInvite.token
            };

            if (typeof req.body.resourceId != 'undefined') {
              data.resourceId = req.body.resourceId;
            }
            var file = fs.readFileSync(process.cwd() + '/views/authentication/invite.ejs', 'ascii');
            var inviteRendered = ejs.render(file, data);
            email.send({
              from: '"Insta Admin Invite" <no-reply@rnd.example.com>', // sender address
              to: req.body.email, // list of receivers
              subject: 'Invitation to Insta Admin',
              html: inviteRendered // html body
            })
            .then(()=>{
              return res.send({status: 'ok',response: 'User ' + req.body.email + ' invite sent.'});
            })
            .catch((err)=>{
              return res.send({status: 'err',response: 'User ' + req.body.email + ' invite was not sent.',moreMsg:err.message});
            });
          });
        }
      });
    });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/auth/login');
  });

  router.get('/logout2', function(req, res) {
    req.logout();
    res.send({status: 'ok',response: 'Logged Out'});
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/auth/login', // redirect back to the signup page if there is an error
    failureFlash: true ,// allow flash messages
    session: true
  }));

  router.put('/reissue',aclMiddleWare(),function(req,res){
    var usermethods = new User();
    var tokenObject  = usermethods.generateReissue();

    var templateData = {
      reIssueLink: config.adminUrl + '/auth/forgot/' + tokenObject.token
    };

    User.findOneAndUpdate({'local.email': req.body.email}, {'$set': {'forgotToken': tokenObject}}, {'upsert': false},
      function(err, data) {
        if (!err) {
          var file = fs.readFileSync(process.cwd() + '/views/authentication/reissue.ejs', 'ascii');
          var reIssueInvite = ejs.render(file, templateData);
          email.send({
            from: '"Insta Admin" <no-reply@rnd.example.com>', // sender address
            to: req.body.email, // list of receivers
            subject: 'Insta Admin forgot password',
            html: reIssueInvite // html body
          })
          .then(()=>{
            return res.send({status: 'ok',response: 'User ' + req.body.email + ' was sent a reissue login.'});
          })
          .catch((err)=>{
            return res.send({status: 'err',response: 'User ' + req.body.email + ' reissue was not sent.',moreMsg:err.message});
          });
        } else {
          res.send({status: 'err',response: 'User ' + req.body.email + ' reissue was not sent. Error creating token.'});
        }
      }
    );
  })

  // process the login form
  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }

      if (!user) { return res.render('authentication/login.ejs',info); }

      req.logIn(user, function(err) {
        if (req.session.redirectTo) {
          var red = req.session.redirectTo;
          delete req.session.redirectTo;
          return res.redirect(red);
        }else {
          return res.redirect('/dashboard');
        }
      });
    })(req, res, next);
  });

  router.get('/signup/oauth', function(req, res, next) {
    passport.authenticate('google-signup', {
      scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read'],
      failureRedirect: '/auth/signup/' + req.query.token, // redirect back to the signup page if there is an error
      failureFlash: true ,// allow flash messages
      session: true,
      state: JSON.stringify({token: req.query.token})
    })(req, res);
  });

  router.get('/signup/oauth/callback', function(req, res, next) {
    passport.authenticate('google-signup', function(err, user, info) {
      if (err) {
        req.flash('error', [info.message]);
        res.redirect('/auth/signup/' + JSON.parse(req.query.state).token);
      } else {
        res.redirect('/dashboard');
      }
    })(req, res, next);
  });

  //need way to message notification to dashboard
  router.get('/me/oauth', function(req, res, next) {
    passport.authenticate('google-add', {
      scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read'],
      successRedirect: '/dashboard/profile', // redirect to the secure profile section
      failureRedirect: '/dashboard/profile', // redirect back to the signup page if there is an error
      passReqToCallback: true
    })(req, res, next);
  });

  router.get('/me/oauth/callback', passport.authenticate('google-add', {
    failureRedirect: '/dashboard/profile?notification=e-Could not add google account.' ,
    passReqToCallback: true
  }), function(req, res) {
    res.redirect('/dashboard/profile');
  });

  router.get('/login/oauth', passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/plus.profile.emails.read']}));

  router.get('/login/callback', passport.authenticate('google', {failureRedirect: '/auth/login',failureFlash: true}), function(req, res) {
    if (req.session.redirectTo) {
      var red = req.session.redirectTo;
      delete req.session.redirectTo;
      return res.redirect(red);
    }else {
      return res.redirect('/dashboard');
    }
  });

  router.get('/signup/:invite', function(req, res) {
    // render the page and pass in any flash data if it exists
    Invite.findOne({'token': req.params.invite}, function(err, invite) {
      if (!invite) {
        invalid = 'You were not sent an invitation to view Insta Admin.';
      } else if (invite.expired()) {
        invalid = 'Your invitation has expired.';
      } else {
        invalid = false;
      }
      var messages = [];
      messages = messages.concat(req.flash('signupMessage'));
      messages = messages.concat(req.flash('loginMessage'));
      messages = messages.concat(req.flash('error'));
      res.render('authentication/signup.ejs', {messages: messages, invalid: invalid, invite: invite});
    });
  });

  router.get('/forgot/:token', function(req, res) {
    if(req.params.token.length < 8) return res.send({status: 'err',response: 'Invalid token'});
    // render the page and pass in any flash data if it exists
    User.findOneAndUpdate({'forgotToken.token': req.params.token}, {'$set': {'forgotToken': {}}}, {'upsert': false},
      function(err, user) {
        if(err || !user){
          return res.send({status: 'err',response: 'Reissued invite not found.'});
        }

        if(user.expiredReissue()){
          return res.send({status: 'err',response: 'Reissued invite expired.'});
        }

        req.logIn(user, function(err) {
          if(err){
            return res.send({status: 'err',response: 'Could not log you in. Please contact admin'});
          } else {
            return res.redirect('/dashboard/profile');
          } 
        });
      }
    );
  });

  router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    if (!req.isAuthenticated()) {
      res.send({status: 'err',response: 'Not authorized. Please login'});
    } else {
      next();
    }
  });

  router.get('/usersRole', function(req, res, next) {
    var aclUsers = [];
    var mergeUsers = function(users, role) {
      aclUsers = aclUsers.concat(users.map(function(user) {
          return {
            _id: user.split(/-(.+)?/)[0],
            handle: user.split(/-(.+)?/)[1],
            role: role
          };
        }));
    };
    Q.all([
      req._acl.roleUsers('admin'),
      req._acl.roleUsers('owner'),
      req._acl.roleUsers('user')
    ]).spread(function() {
      var roles = ['admin','owner','user'];
      for (var i = 0; i < arguments.length; i++) {
        mergeUsers(arguments[i], roles[i]);
      }
    }).fin(function() {
      res.setHeader('Content-Type', 'application/json');
      return res.send({status: 'ok',response: 'Recieved users.',data: aclUsers});
    });
  });

  router.delete('/users/:userId', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    User.findOne({_id: req.params.userId}).lean().exec(function(err, user) {
      if (!err&&user) {
        var aclId = user._id + '-' + user.local.email;
        req._acl.userRoles(aclId,function(err,roles){
          req._acl.removeUserRoles(aclId,roles,function(err,some){
            User.findOneAndRemove({_id: req.params.userId}).lean().exec(function(err) {
              if (!err) {
                return res.send({status: 'ok',response: 'User permissions removed, user deleted.'});
              } else {
                return res.send({status: 'err',response: 'User not deleted.'});
              }  
            });
          });
        });
      } else {
        return res.send({status: 'err',response: 'No user with that id.'});
      }
    });
  });

  router.put('/usersRole/:userId', aclMiddleWare(), function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (typeof req.body.role == 'undefined' || 'admin|owner|user'.indexOf(req.body.role) === -1) {
      return res.send({status: 'err',response: 'Role must be admin, owner or user.'});
    }

    User.findOne({_id: req.params.userId}).lean().exec(function(err, user) {
      if (err || !user) {
        return res.send({status: 'err',response: 'No user found.'});
      }
      var aclId = user._id + '-' + user.local.email;

      req._acl.removeUserRoles(aclId, ['admin','owner','user'], function(err) {
        if (err) {
          return res.send({status: 'err',response: 'Could not remove old base roles.'});
        }
        req._acl.addUserRoles(aclId, req.body.role, function(err) {
          if (err) {
            return res.send({status: 'err',response: 'Could not add new base role.'});
          } else {
            return res.send({status: 'ok',response: 'Role update.'});
          }
        });
      });
    });
  });

  router.get('/users', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    User.find({}).select('local _id').lean(true).exec(function(err, users) {
      if (!err) {
        return res.send({status: 'ok',response: 'Got Users',data: users});
      } else {
        return res.send({status: 'err',response: 'No Users'});
      }
    });
  });

  router.get('/users/:userId', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    User.findOne({_id: req.params.userId}).lean().exec(function(err, user) {
      if (!err&&user) {
        var aclId = user._id + '-' + user.local.email;
        req._acl.userRoles(aclId,function(err,roles){
          user.roles = roles;
          req._acl.whatResources(roles,function(err,resource){
            user.resources = resource;
            return res.send({status: 'ok',response: 'Got user info.',data: user});
          })
        })
      } else {
        return res.send({status: 'err',response: 'No user with that id.'});
      }
    });
  });

  router.all('/me/*', function(req, res, next) {
    if (typeof req.user == 'undefined') {
      res.writeHead(401, 'UnAuthorized', {'content-type': 'application/json'});
      res.end(JSON.stringify({status: 'err',response: 'Must be logged in to access this endpoint.'}));
      return;
    }

    User.findOne({_id: req.user._id.toString()}, function(err, me) {
      if (me) {
        next();
      } else {
        res.writeHead(401, 'UnAuthorized', {'content-type': 'application/json'});
        res.end(JSON.stringify({status: 'err',response: 'User does not exist.'}));
        return;
      }
    });
  });

  router.get('/me', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var me = req.user;

    if (typeof me.local.password != 'undefined') {
      me.local.password = null;
    }
    if (typeof me.google.token != 'undefined') {
      me.google.token = null;
    }
    if (typeof me.twitter.token != 'undefined') {
      me.twitter.token = null;
    }
    if (typeof me.facebook.token != 'undefined') {
      me.facebook.token = null;
    }

    return res.send({status: 'ok',response: 'User recieved.',data: me});
  });

  router.put('/me/password', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    if (typeof req.body.newPassword != 'undefined' && req.body.newPassword.match(new RegExp(/[a-zA-Z0-9]{8,}/))) {

      var usermethods = new User();
      var hashed  = usermethods.generateHash(req.body.newPassword);
      User.findOneAndUpdate({_id: req.user._id.toString()}, {'$set': {'local.password': hashed}}, {'upsert': false},
        function(err, data) {
          if (!err) {
            res.send({status: 'ok',response: 'Password changed.'});
          } else {
            res.send({status: 'err',response: 'Password was not changed.'});
          }

        }
      );
    } else {
      res.send({status: 'err',response: 'No new password sent.'});
    }
  });

  router.put('/me/email', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    //TODO fix
    return res.send({status: 'err',response: 'Currently under maintainance.'});
    if (typeof req.body.newEmail != 'undefined') {
      User.findOneAndUpdate({_id: req.user._id.toString()}, {'$set': {'local.email': req.body.newEmail}}, {'upsert': false},
        function(err, data) {
          if (!err) {
            res.send({status: 'ok',response: 'Email changed.'});
          } else {
            res.send({status: 'err',response: 'Email was not changed.'});
          }

        }
      );
    } else {
      res.send({status: 'err',response: 'No new email sent.'});
    }
  });

  router.delete('/me/oauth', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');

    if (typeof req.query.oauthType != 'undefined') {
      var set = {};
      set.google = {};
      User.findOneAndUpdate({_id: req.user._id.toString()}, {'$set': set}, {'upsert': false},
        function(err, data) {
          if (!err) {
            res.send({status: 'ok',response: 'Deleted ' + req.query.oauthType + ' data.'});
          } else {
            res.send({status: 'err',response: 'Did not delete ' + req.query.oauthType + ' data.'});
          }
        }
      );
    } else {
      res.send({status: 'err',response: 'No OAuth account type sent.'});
    }
  });

  return router;
};
