var express = require('express');
var config = require('./config/index.js');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Acl = require('acl');
var swaggerJSDoc = require('swagger-jsdoc');
var swaggerOptions = require('./config/swaggerOptions.js');

var passport = require('passport');

var session  = require('express-session');
var FileStore = require('session-file-store')(session);
var flash    = require('connect-flash');

require('./config/database.js');


var app = express();

app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport')(passport); // pass passport for configuration




// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(swaggerOptions);

Acl = new Acl(new Acl.mongodbBackend(mongoose.connection.db, 'acl_', true));

app.use(function(req, res, next) {
  req._acl = Acl;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false,limit: '5mb'}));
app.use(cookieParser('dawsonsCreekIdontWantToWait'));

var cookieOptions = {};
var sessionName = '';
var fileStoreOptions = {
  path: './storage/sessions',
  ttl: 7200
};

if (app.get('env') == 'production') {
  cookieOptions.secure = false;
  cookieOptions.expires = new Date(Date.now() + 3600000);
  cookieOptions.maxAge = 3600000;
  sessionName = 'Site_instaaap';
} else if (app.get('env') == 'development') {
  sessionName = 'Site_instaaap_dev';
} else {
  sessionName = 'Site_instaaap_local';
}
//userauth
app.use(session({
  store: new FileStore(fileStoreOptions),
  secret: 'dawsonsCreekIdontWantToWait' ,
  name: sessionName,
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: cookieOptions
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var authentication = require('./routes/authentication')(passport);

var routes = require('./routes/index');
var instaAppsApi = require('./routes/instaAppsApi');
var componentFabricationApi = require('./routes/componentFabricationApi');
var templateFabricationApi = require('./routes/templateFabricationApi');
var genericApi = require('./routes/genericApi');

app.use(['/docs/api*','/docs/app*'], function(req,res,next){
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.writeHead(401, 'UnAuthorized', {'content-type': 'application/json'});
    res.end(JSON.stringify({status: 'err',response: 'Must be logged in to access this doc.'}));
    return;
  }
});


//routes
app.use(function(req, res, next) {
  if (req.method === 'OPTIONS') {
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers['Access-Control-Allow-Origin'] = '*';
    headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE, OPTIONS, COPY';
    headers['Access-Control-Allow-Credentials'] = false;
    headers['Access-Control-Max-Age'] = '86400'; // 24 hours
    headers['Access-Control-Allow-Headers'] = 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept';
    res.writeHead(200, headers);
    res.end();
  } else {
    next();
  }
});

app.use('/', routes);
app.use('/auth', authentication);
//V1 api
app.use('/api/instaapp/',  genericApi);
app.use('/api/instaapp/v1/', instaAppsApi, componentFabricationApi, templateFabricationApi);
//V2 api
app.use('/api/v2/', instaAppsApi, componentFabricationApi, templateFabricationApi, genericApi);
// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'local') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

