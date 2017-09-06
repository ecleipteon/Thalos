function deletef(fid) {
  var name = $('a.btn.btn-xs.btn-success').attr('name');
  var passphrase = document.getElementById("bloadlistform").elements[0].value;
  var keyfile = document.getElementById("bloadlistform").elements[1].files[0];
  var bpassphrase = document.getElementById("bp_"+name).value;

  getFileList(keyfile, passphrase, name, bpassphrase, function(data, privKeyObj, privKeyObj4, bpublic){

    var filelist = JSON.parse(data);

    $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
    $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
    $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket description decrypted </span>');
    $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Deleting selected file </div>');

    var index = -1;
    var myfile = filelist.files.find(function(item, i){
               if(item.id === fid){
                 index = i;
                 return i;
               }
             });

    filelist.files.splice(index, 1);

    var boptions = {
              data: JSON.stringify(filelist),
              publicKeys: openpgp.key.readArmored(bpublic).keys,
              privateKeys: privKeyObj4
          };

          openpgp.encrypt(boptions).then(function(ciphertext) {
                 var encryptedesc = btoa(ciphertext.data);

                 var xhrs = new XMLHttpRequest();
                 var sparameters = ('op=del&desc='+encryptedesc+'&bid='+name+'&fid='+fid);

                 xhrs.open("POST", '/user/updatebasket', true);
                 xhrs.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                 $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
                 $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
                 $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket description decrypted </span>');
                 $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> File deleted  </span>');
                 $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Updating descriptions </div>');

                 xhrs.onreadystatechange = function() {
                   if (xhrs.readyState==4 && xhrs.status==200) {
                     $('.loadlist').html(' ');
                     $('#'+fid).addClass('disabled');

                     $('.loadlist').html('');

                     }
                 }

               xhrs.send(sparameters);

          });
  });

};
