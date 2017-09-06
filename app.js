var express = require('express');
var path = require('path');
var passport = require('passport');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var env = require('dotenv').load();
var openpgp = require('openpgp');


var app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({limit: '5mb'}));

app.use(session({ secret:'giudaballerino',
                  resave:true,
                  saveUninitialized:true
                }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var index = require('./routes/index');
var models = require('./models');
var users = require('./routes/users');
var apis = require('./routes/api');



app.use('/', index);
app.use('/user', require('./routes/users')(passport));
app.use('/api/user', require('./routes/api')(passport));
require('./controllers/passport.js')(passport);

openpgp.initWorker({path: 'openpgp.worker.js'});
openpgp.config.aead_protect = true;

models.sequelize.sync().then(function(){
  console.log("Database connesso");
}).catch(function(err) {
  console.log(err, "Somenthing went wrong with the dbdbdb");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
