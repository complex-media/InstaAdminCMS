var express = require('express');
var router = express.Router();
var moment = require('moment');
var config = require('../config/index.js');
var wsService = require('../services/webSocketService');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // console.log('isAuthenticated',req.isAuthenticated());
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  req.session.redirectTo = req.path;
  if (typeof req.query.m != 'undefined') {
    req.session.redirectTo = req.session.redirectTo + '?m=' + req.query.m;
  }
  res.redirect('/auth/login');
}

/* GET home page.yep */
router.get('/', function(req, res, next) {
  res.redirect('/dashboard');
});

router.get('/appInfo', function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send({status: 'err',response: 'Need to be logged in.'});
  }
  var data = [];
  data.push("Current Time: " + moment().format('YYYY-MM-DDTHH:mm:ss'));

  res.send({status: 'ok',response: 'Insta info',data: data.join(', ')});
});

router.get('/status', function(req, res, next) {
  res.status(200).send('ALIVE');
});

router.get('/dashboard', isLoggedIn, function(req, res, next) {
  req._acl.userRoles(req.user._id.toString() + '-' + req.user.local.email, function(err, roles) {
    var role = 'user';
    if (roles.join('|').indexOf('admin') !== -1) {
      role = 'admin';
    } else if (roles.join('|') == 'owner' || roles.join('|').indexOf('owner|') !== -1) {
      role = 'owner';
    }

    res.render('dashboard/index2.ejs', {
      user: req.user,
      role: role,
      domain: config.adminUrl,
      wsHash: wsService.createToken()
    });
  });
});

router.get('/dashboard/*', isLoggedIn, function(req, res, next) {
  req._acl.userRoles(req.user._id.toString() + '-' + req.user.local.email, function(err, roles) {
    var role = 'user';

    if (roles.join('|').indexOf('admin') !== -1) {
      role = 'admin';
    } else if (roles.join('|') == 'owner' || roles.join('|').indexOf('owner|') !== -1) {
      role = 'owner';
    }

    res.render('dashboard/index2.ejs', {
      user: req.user,
      role: role,
      domain: config.adminUrl,
      wsHash: wsService.createToken()
    });
  });
});

router.get('/dashboard2', isLoggedIn, function(req, res, next) {
  req._acl.userRoles(req.user._id.toString() + '-' + req.user.local.email, function(err, roles) {
    var role = 'user';
    if (roles.join('|').indexOf('admin') !== -1) {
      role = 'admin';
    } else if (roles.join('|') == 'owner' || roles.join('|').indexOf('owner|') !== -1) {
      role = 'owner';
    }

    res.render('dashboard/index2.ejs', {
      user: req.user,
      role: role,
      domain: config.adminUrl,
      wsHash: wsService.createToken()
    });
  });
});

router.get('/dashboard2/*', isLoggedIn, function(req, res, next) {
  req._acl.userRoles(req.user._id.toString() + '-' + req.user.local.email, function(err, roles) {
    var role = 'user';

    if (roles.join('|').indexOf('admin') !== -1) {
      role = 'admin';
    } else if (roles.join('|') == 'owner' || roles.join('|').indexOf('owner|') !== -1) {
      role = 'owner';
    }

    res.render('dashboard/index2.ejs', {
      user: req.user,
      role: role,
      domain: config.adminUrl,
      wsHash: wsService.createToken()
    });
  });
});

module.exports = router;
