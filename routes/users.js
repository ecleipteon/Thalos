var express = require('express');
var authcontroller = require('./../controllers/authcontroller');
var dashcontroller = require('./../controllers/dashcontroller');
var basketcontroller = require('./../controllers/basketcontroller');

module.exports = function(passport) {
  var router = express.Router();

  router.get('/', function(req,res, next) {
    res.redirect('/user/dashboard');
  });

  router.get('/signin', authcontroller.signin);

  router.get('/signup', notLogged, function(req,res,next) {
    res.render('signup', {message: req.flash('loginMessage')});
  });

  router.all('/dashboard', isLogged, dashcontroller.showdashboard);
  router.post('/addpubbKey', isLogged1, dashcontroller.addpubbKey);
  router.post('/addbasket', isLogged1, dashcontroller.addBasket);
  router.post('/getbasefile', isLogged1, dashcontroller.getBasefile);
  router.post('/getfile', isLogged1, basketcontroller.getFile);
  router.post('/getbasket', isLogged1, basketcontroller.getBasket);
  router.post('/updatebasket', isLogged1, basketcontroller.updateBasket);
  router.post('/deletebasket', isLogged1, basketcontroller.deleteBasket);

  router.get('/logout', function(req,res,next) {
    req.logout();
    res.redirect('/');
  });

  router.get('/storage', isLogged, function(req,res, next) {
    res.render('storage', {title: 'Thalos', user: req.user});
  });

  router.get('/share', isLogged, function(req,res, next) {
    res.send('Not yet implemented');
  });

  router.get('/test', function(req,res,next) {
    res.send('Buongiorno principessa');
  });

  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/user/sendData',
    failureRedirect: '/user/signup'
    }));


  router.post('/signin', notLogged, passport.authenticate('local-signin', {
    successRedirect: '/api/user/dashboard',
    failureRedirect: '/api/user/dashboard'
    }));

  router.get('/activate/:token', authcontroller.validateUser, function(req, res, next) {
    req.logout();
    res.render('signin', {notice: req.flash('loginMessage', 'Account enabled, please log in')});
  });

  router.get('/activate/', function(req,res,next) {
    res.send('Missing token');
  });


    router.get('/sendData', isLogged, function(req,res,next) {
      res.render('sendData', {token: req.user.activation_token});
    });


  return router;
};

function isLogged(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
};

function isLogged1(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.json({'status':'auth failed'});
};

function notLogged(req, res, next) {
  if (!req.isAuthenticated())
    return next();

  res.redirect('/user/dashboard');
};
