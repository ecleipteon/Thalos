var express = require('express');
var authcontroller = require('./../controllers/authcontroller');
var dashcontroller = require('./../controllers/api/dashcontroller');
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

  router.get('/dashboard', isLogged, dashcontroller.showdashboard);
  router.post('/addpubbKey', isLogged, dashcontroller.addpubbKey);
  router.post('/addbasket', isLogged, dashcontroller.addBasket);
  router.post('/getbasefile', isLogged, dashcontroller.getBasefile);
  router.post('/getfile', isLogged, basketcontroller.getFile);
  router.post('/getbasket', isLogged, basketcontroller.getBasket);
  router.post('/updatebasket', isLogged, basketcontroller.updateBasket);
  router.post('/deletebasket', isLogged, basketcontroller.deleteBasket);

  // Request for upload
  router.get('/rup', isLogged, dashcontroller.request4upload);

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
    failureRedirect: '/user/signup',
    failureFlash:true
  }));


  router.post('/signin', notLogged, passport.authenticate('local-signin', {
    successRedirect: '/api/user/dashboard',
    failureRedirect: '/api/user/signin',
    failureFlash:true
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
  else
    res.json({session: req.sessionID, auth:req.isAuthenticated()});
};

function isLogged1(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.json({'auth':'false'});
};

function notLogged(req, res, next) {
  if (!req.isAuthenticated())
    return next();

  res.redirect('/user/dashboard');
};
