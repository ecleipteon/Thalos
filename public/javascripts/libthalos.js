function getBasketList(keyfile, passphrase, callback) {
  $('.loadlist').html('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Retrieving user basefile </div>');

  var xhr2 = new XMLHttpRequest();

  xhr2.open("POST", '/user/getbasefile', true);
  xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr2.onreadystatechange = function() {
    if (xhr2.readyState==4 && xhr2.status==200) {


      var encryptedbasefile = atob(JSON.parse(xhr2.responseText).basefile);
      var user_public = atob(JSON.parse(xhr2.responseText).public);
      var bcount = JSON.parse(xhr2.responseText).bcount;
      var userid = JSON.parse(xhr2.responseText).userid;


      $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
      $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Decrypting user basefile </div>')

      if(keyfile) {
        var reader = new FileReader();
        reader.readAsText(keyfile, "UTF-8");

        reader.onload = function(e) {
          var privatekey = atob(e.target.result);

          var privKeyObj = openpgp.key.readArmored(privatekey).keys[0];
          privKeyObj.decrypt(passphrase);

          opts = {
            message: openpgp.message.readArmored(encryptedbasefile),
            publicKeys: openpgp.key.readArmored(user_public).keys,
            privateKey: privKeyObj
          };

          openpgp.decrypt(opts).then(function(plaintext) {
             $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
             $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
             $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Rendering basket list </div>');

             callback(plaintext.data, privKeyObj);
           });
        }
      }
    } else {
      $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-remove" aria-hidden="true"> Something terrible happened </span>');
    }
  }
  xhr2.send();


}


function getFileList(keyfile, passphrase, basket_name, bpassphrase, callback) {
  var name = basket_name;
  getBasketList(keyfile, passphrase, function(data, privKeyObj) {
    var basketlist = JSON.parse(data);
    var index = -1;
    var mybasket = basketlist.baskets.find(function(item, i){
               if(item.name === name){
                 index = i;
                 return i;
               }
             });

    var basket_private = atob(basketlist.baskets[index].key);

    var xxhttp = new XMLHttpRequest();

    xxhttp.open("POST", '/user/getbasket', true);
    xxhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xxhttp.onreadystatechange = function() {
      if (xxhttp.readyState==4 && xxhttp.status==200) {
        var encryptedcontent = atob((JSON.parse(xxhttp.responseText)).description);
        var basket_id = JSON.parse(xxhttp.responseText).basket_id;
        var basket_public = atob(JSON.parse(xxhttp.responseText).public);

        var privKeyObj4 = openpgp.key.readArmored(basket_private).keys[0];
        privKeyObj4.decrypt(bpassphrase);

        bopts = {
          message : openpgp.message.readArmored(encryptedcontent),
          publicKeys: openpgp.key.readArmored(basket_public).keys,
          privateKey: privKeyObj4
        }

        var tmp = openpgp.decrypt(bopts).then(function(plaintext) {

        callback(plaintext.data, privKeyObj, privKeyObj4, basket_public);


        });

      }
    }
    xxhttp.send('bid='+name);


  });
}
