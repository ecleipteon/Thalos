const db = require('./../models/');
var bCrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
var randomstring = require('randomstring');

var User = db.user;

module.exports = function(passport,user) {

    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy(

        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, email, password, done) {


            User.findOne({
                where: {
                    email: email
                }
            }).then(function(user) {
                if (user) {
                  return done(null, false, {message : req.flash('signupMessage','email already taken')});
                  console.log('mail already taken');
                }
                else {
                    var pass = generateHash(password);
                    var token = randomstring.generate(13);
                    var token2 = randomstring.generate(13);
                    var data =

                        {
                            email: email,
                            password: pass,
                            username: req.body.username,
                            public_key: '0',
                            last_login: null,
                            activation_token: token,
                            base_token: token2

                        };

                    User.create(data).then(function(newUser, created) {

                        if (!newUser) {

                            return done(null, false);

                        }

                        if (newUser) {

                            return done(null, newUser, {message: req.flash('tappost')});

                        }

                    });
                }

            }).catch(function(err) {
              console.log(err);
            });

        }

    ));

passport.use('local-signin', new LocalStrategy(

    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
      function(req, email, password, done) {
          User.findOne({
              where: {email: email}
          }).then(function(user) {
              if (!user) {
                return done(null, false, req.flash('loginMessage', 'Incorrect email or password'));
              }

              if (!isValidPassword(user.password, password)) {

                return done(null, false, req.flash('loginMessage', 'Incorrect email or password'));
              }

              if(user.status == 'inactive') {
                return done(null, false, req.flash('loginMessage', 'Please activate your account first'));
              }




              var userinfo = user.get();
              return done(null, userinfo);


          }).catch(function(err) {

              console.log("Error:", err);

              return done(null, false, req.flash('loginMessage', 'Something bad happened'));

          });


      }

  ));


    passport.serializeUser(function(user, done) {
            console.log("abc serializeUser");
            console.log(user);
            done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
            console.log("abc deserializeUser");
            User.findById(id).then(function(user){
                done(null, user);
            }).catch(function(e){
                done(e, false);
            });
    });



    var generateHash = function(password) {
          return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    var isValidPassword = function(userpass, password) {
            return bCrypt.compareSync(password, userpass);
    };



}
