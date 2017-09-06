var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Thalos' });
});

router.get('/contact', function(req,res,next) {
  res.render('contacts');
});

module.exports = router;
