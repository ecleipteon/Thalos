var db = require('./../models/');


var exports = module.exports = {}

exports.signup = function(req, res) {
    res.render('signup', {title: 'Thalos', message: req.flash('signupMessage')});
}

exports.signin = function(req, res) {
    req.logout();
    res.render('signin', {title: 'Thalos', message: req.flash('loginMessage')});

}

exports.validateUser = function(req, res, next) {
  var User = db.user;

  User.findOne({
      where: {activation_token: req.params.token}
  }).then(function(user) {
      user.updateAttributes({
        status: 'active',
        activation_token : '0'
      }).then(() => {
        return null;
      })
      .catch((err) => {
        console.log('Error:', err);
      })

    }).catch(function(err) {
    console.log('Error:', err);

  });

  next();

}
