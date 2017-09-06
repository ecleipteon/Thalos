var fs = require('fs');
var path = require('path');
var db = require('./../models/');


var exports = module.exports = {}

exports.getFile = function(req,res, next) {

  var fid = req.body.fid;
  var p = path.join(__dirname, '..', 'public','maze');
  var filename = p+'/'+fid+'.th';

  fs.readFile(filename, 'utf8', function (err,data) {
      if (err)
        return console.log(err);

      res.json({'outcome': 'ok', 'filecontent': data});
    });
}

exports.getBasket = function(req,res,next) {
  var Basket = db.basket;
  var bid = req.body.bid+'_'+req.user.id;

  //console.log('\n\n\n\n\n'+ req.body.bid + '\n\n\n\n\n' + bid);

  Basket.findOne({
      where: {name: bid}
  }).then(function(basket) {

    res.json ({
                'basket_id': basket.basket_id,
                'description': basket.description,
                'public': basket.public,
                'ownership': basket.ownership
              });

      }).catch(function(err) {
      console.log('Error:', err);
      res.json({'outcome': 'failed'});

    });

};

exports.deleteBasket = function(req,res,next) {
  res.send('not yet');
};

exports.updateBasket = function(req,res,next) {
  var Basket = db.basket;
  var op = req.body.op;
  var bid = req.body.bid+'_'+req.user.id;
  var fid = req.body.fid;

  if(op=='add') {
    var file = req.body.file;
    var desc = req.body.desc;
    var sign = req.body.sign;

    var p = path.join(__dirname, '..', 'public','maze');
    var filename = p+'/'+fid+'.th';

    Basket.findOne({
      where: {'name' : bid}
    }).then(function(basket) {
      basket.updateAttributes({
        'description' : desc
      }).then(() => {
        fs.writeFile(filename, file, function(err) {
          if(err)
            return console.log(err);

        console.log("The file was saved!");
        });

        res.json({'outcome': 'ok'});
      }).catch((err) => {
        console.log('Error', err);
        res.json({'outcome': 'db_error'});
      });
    }).catch(function(err) {
      console.log('Error:', err);
      res.json({'outcome': 'db_error'});
    });

  } else if (op=='del') {
    var p = path.join(__dirname, '..', 'public','maze');
    var filename = p+'/'+fid+'.th';
    var desc = req.body.desc;

    Basket.findOne({
      where: {'name' : bid}
    }).then(function(basket) {
      basket.updateAttributes({
        'description' : desc
      }).then(() => {
        fs.unlinkSync(filename);


        console.log("The file was removed!");


        res.json({'outcome': 'ok'});
      }).catch((err) => {
        console.log('Error', err);
        res.json({'outcome': 'db_error'});
      });
    }).catch(function(err) {
      console.log('Error:', err);
      res.json({'outcome': 'db_error'});

    });

  } else {
    res.json({'outcome': 'failed'});
  }

};
