$(document).ready(function() {

  $('[data-toggle="tooltip"]').tooltip();

  $('[data-toggle="popover"]').popover();

  $("#genkeyButton").click(function() {
    $("#genkeyModal").modal('show');
  });

});


$(function() {
    $("li.basket").click(function() {
      $("li.basket").removeClass("active")
      $(".dashpanel").attr('style', 'display:none');
      $(".baskpanel").attr('style', 'display:');
      $("li.infos").removeClass("active")
      $(this).addClass('active')


    });

    $("li.infos").click(function() {
      $("li.basket").removeClass("active")
      $("li.infos").addClass("active")



    });



    $(".closebutt").click(function() {
      $(location).attr('href', '/user/dashboard')
    });




});






function genkey(username, email) {
    var elements = document.getElementById("genkeyform").elements;
    var obj ={};
    for(var i = 0 ; i < elements.length ; i++){
        var item = elements.item(i);
        obj[item.name] = item.value;
    }

    $('.keylink').html('<img src="/images/loadingq.gif" height="20" width="20" />')

    var opts = {
    userIds: [{ name: username, email: email }], // multiple user IDs
    numBits: 4096,                                            // RSA key size
    passphrase: obj.passphrase         // protects the private key
    };

    openpgp.generateKey(opts).then(function(key) {

      var privkey = key.privateKeyArmored;
      var pubkey = key.publicKeyArmored;


      $('.closebutt').click(function() {
         location.reload();
      });

      var basefile = {
                        "baskets": [
                          {
                            "basket_id": "0",
                            "key": '0',
                            "name" : '0'
                          },
                          {
                            "basket_id": "0",
                            "key": '0',
                            "name" : '0'
                          },
                          {
                            "basket_id": "0",
                            "key": '0',
                            "name" : '0'
                          }
                        ]
                      };


      var privKeyObj = openpgp.key.readArmored(privkey).keys[0];
      privKeyObj.decrypt(obj.passphrase);

      options = {
        data: JSON.stringify(basefile),
        publicKeys: openpgp.key.readArmored(pubkey).keys,
        privateKeys: privKeyObj //for signing
      };

      openpgp.encrypt(options).then(function(ciphertext) {
          encrypted = ciphertext.data;

          var xhttp = new XMLHttpRequest();
          var p = "public_key="+btoa(pubkey)+"&base="+btoa(encrypted);

          xhttp.open("POST", '/user/addpubbKey', true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

          xhttp.onreadystatechange = function() {
            if (xhttp.readyState==4 && xhttp.status==200) {
              var keyfile = null;
              var data = new Blob([btoa(privkey)], {type: 'text/plain'});
              var url = window.URL.createObjectURL(data);


              $('.keylink').html('<img src="/images/done.png" height="20" width="20" /> ')
              $('.keylink').append('<a download="MasterKey.thalos" href="'+url+'" > Download your key</a>');
              $('.genbutt').addClass('disabled');
              $('.genbutt').prop('onclick',null).off('click');

            delete privKeyObj;
            delete privatekey;
            delete obj.passphrase;

            }
          };

          xhttp.send(p);
      });


    });
}

function addnewbasket() {
  var passphrase = document.getElementById("addbaskeform").elements[0].value;
  var bname = document.getElementById("addbaskeform").elements[2].value;
  var basketpassphrase = (document.getElementById("addbaskeform").elements[3].value);



  $('.htmlresults').html('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Retrieving user basefile </div>');
  $('.htmlresults').append('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="20 aria-valuemin="0" aria-valuemax="100" style="width: 20%">');
  $('.htmlresults').append('<span class="sr-only">20%</span></div></div>');


  var xhttp = new XMLHttpRequest();

  var bdesc =  {
              	"files": [{
              		"name": "Sample",
              		"type": "text",
              		"filesize": "size",
              		"id": "id",
                  "signature": "0"
              	}],
                "size": 0
              };

  xhttp.open("POST", '/user/getbasefile', true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState==4 && xhttp.status==200) {
      $('.htmlresults').html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">');
      $('.htmlresults').append('<span class="sr-only">40%</span></div></div>');
      $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
      $('.htmlresults').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Decrypting user basefile </div>')


      var encryptedbasefile = atob(JSON.parse(xhttp.responseText).basefile);
      var user_public = atob(JSON.parse(xhttp.responseText).public);
      var bcount = JSON.parse(xhttp.responseText).bcount;
      var userid = JSON.parse(xhttp.responseText).userid;

      var keyfile = document.getElementById("addbaskeform").elements[1].files[0];

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


         var tmp =  openpgp.decrypt(opts).then(function(plaintext) {
            $('.htmlresults').html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">');
            $('.htmlresults').append('<span class="sr-only">60% </span></div></div>');
            $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
            $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
            $('.htmlresults').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Generating basket keys </div>');

            bemeail = 'basket_'+userid+'@thalos.th';

            var opts2 = {
              userIds: [{ name: bname, email: bemeail}],
              numBits: 4096,
              passphrase: basketpassphrase
            };

            basefile = JSON.parse(plaintext.data);

            openpgp.generateKey(opts2).then(function(key) {

              var  basket_private = key.privateKeyArmored;
              var  basket_public = key.publicKeyArmored;

              $('.htmlresults').html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">');
              $('.htmlresults').append('<span class="sr-only">80% </span></div></div>');
              $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
              $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
              $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket keys generated </span>');
              $('.htmlresults').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Basefile updating </div>');


              if (bcount > 2 ) {
                $('.htmlresults').html('<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-warning active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 45%">');
                $('.htmlresults').append('<span class="sr-only"> Error</span></div></div>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket keys generated </span>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-remove" aria-hidden="true"> You can\'t have more then three baskets </span>');


              } else {

                basefile.baskets[bcount].key = btoa(basket_private);
                basefile.baskets[bcount].basket_id = userid+'_'+bcount;
                basefile.baskets[bcount].name = bname;

                $('.htmlresults').html('<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100" style="width: 90%">');
                $('.htmlresults').append('<span class="sr-only">90% </span></div></div>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket keys generated </span>');
                $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile updated </span>');
                $('.htmlresults').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Encrypting  basefile</div>');


                options = {
                      data: JSON.stringify(basefile),
                      publicKeys: openpgp.key.readArmored(user_public).keys,
                      privateKeys: privKeyObj // for signing (optional)
                  };


                var privKeyObj2 = openpgp.key.readArmored(basket_private).keys[0];
                privKeyObj2.decrypt(basketpassphrase);

                  boptions = {
                        data: JSON.stringify(bdesc),
                        publicKeys: openpgp.key.readArmored(basket_public).keys,
                        privateKeys: privKeyObj2 // for signing (optional)
                    };

                  openpgp.encrypt(options).then(function(ciphertext1) {
                    openpgp.encrypt(boptions).then(function(chiphertext2) {
                      encrypted1 = btoa(ciphertext1.data);
                      encrypted2 = btoa(chiphertext2.data);

                      xhr = new XMLHttpRequest();
                      var params = 'bname='+bname+'&basefile='+encrypted1+'&desc='+encrypted2+'&pbk='+btoa(basket_public)

                      xhr.open("POST", '/user/addbasket', true);
                      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                      xhr.onreadystatechange = function() {

                        if (xhr.readyState==4 && xhr.status==200) {
                          var tmp1 = JSON.parse(xhr.responseText).basketcount
                          $('p.baskcounthtml').html(tmp1);

                          $('.htmlresults').html('<div class="progress"><div class="progress-bar progress-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">');
                          $('.htmlresults').append('<span class="sr-only"> Complete </span></div></div>');
                          $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
                          $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
                          $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket keys generated </span>');
                          $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile updated </span>');
                          $('.htmlresults').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile encrypted and stored </span>');


                          if(tmp1 == 3) {

                            $('a.btn.btn-lg.btn-success.addnewbasketbtn').attr('data-toggle', 'tooltip') ;
                            $('a.btn.btn-lg.btn-success.addnewbasketbtn').attr('data-placement', 'right');
                            $('a.btn.btn-lg.btn-success.addnewbasketbtn').attr('title', 'You can\'t have more than 3 baskets');
                            $('a.btn.btn-lg.btn-success.addnewbasketbtn').removeClass('addnewbasketbtn');
                            $('[data-toggle="tooltip"]').tooltip();
                          }
                        }
                      }

                      xhr.send(params);

                  });




                });



              }


            });


          });


        }
      }



    }

    if(xhttp.readyState==4 && xhttp.status != 200) {
      $('.htmlresults').html('<div class="row"><span class="glyphicon glyphicon-remove" aria-hidden="true"> Something went wrong while retrieving the basefile </span>');
      $('.htmlresults').append('<div class="progress"><div class="progress-bar progress-bar-striped progress-bar-warning active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 45%">');
      $('.htmlresults').append('<span class="sr-only"> Error</span></div></div>');


    }
  }
  xhttp.send();


}
