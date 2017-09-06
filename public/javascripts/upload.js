$(document).ready(function() {

  $(".upfilebutton").click(function() {
     uploadf();
  });

});

function uploadf() {
  var name = $('a.btn.btn-xs.btn-success').attr('name');
  var passphrase = document.getElementById("bloadlistform").elements[0].value;
  var keyfile = document.getElementById("bloadlistform").elements[1].files[0];
  var upfile = document.getElementById("upfileform").elements[0].files[0];
  var bpassphrase = document.getElementById("bp_"+name).value;
  var filename = document.getElementById("upfileform").elements[0].value;
  var filesize = document.getElementById("upfileform").elements[0].files[0].size;

  if(upfile) {
    var reader2 = new FileReader();
    reader2.readAsDataURL(upfile);

    reader2.onloadend = function() {
      var clearfile = reader2.result;

      var filetype = clearfile.split(";")[0];
      filetype = filetype.split("/")[1];

      filename = filename.split("\\");
      filename = filename[filename.length-1]


      getFileList(keyfile, passphrase, name, bpassphrase, function(data, privKeyObj, privKeyObj4, bpublic){

        var filelist = JSON.parse(data);
        var basketsize = parseInt(filelist.size) + filesize;
        var fid = generateRandAlphaNumStr(199);

     $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
     $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
     $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket description decrypted </span>');
     $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Encrypting new file (this operation may take few minutes) </div>');

       var fileinfo = {
                      "name": filename,
                      "type": filetype,
                      "filesize": filesize,
                      "id": fid,
                      "signature": "0"
                   };


       filelist.size = basketsize;
       filelist.files.push(fileinfo);


        //Update basket description
        var boptions = {
                  data: JSON.stringify(filelist),
                  publicKeys: openpgp.key.readArmored(bpublic).keys,
                  privateKeys: privKeyObj4
              };


       var foptions = {
                 data: clearfile,
                 publicKeys: openpgp.key.readArmored(bpublic).keys,
                 privateKeys: privKeyObj4
       };



       //openpgp.sign(foptions).then(function(signed) {
      // var signature = btoa(signed.data);
      // Troubles with file signature. If signature is calculated errors appears when trying
      // to decrypt the updated basket description

      openpgp.encrypt(boptions).then(function(ciphertext) {
             var encryptedesc = btoa(ciphertext.data);

         openpgp.encrypt(foptions).then(function(ciphertext) {
                var encryptedfile = btoa(ciphertext.data);

                       var xhrs = new XMLHttpRequest();
                       var sparameters = ('op=add&file='+encryptedfile+'&desc='+encryptedesc+/*'&sign='+signature+*/'&bid='+name+'&fid='+fid);

                       xhrs.open("POST", '/user/updatebasket', true);
                       xhrs.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                       $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
                       $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
                       $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket description decrypted </span>');
                       $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> File secured  </span>');
                       $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Sending file to the cloud </div>');

                       xhrs.onreadystatechange = function() {
                         if (xhrs.readyState==4 && xhrs.status==200) {
                           $('.loadlist').html(' ');
                           $('.filetable').append('<tr><td>'+filename+'</td><td>'+filesize+'</td><td>'+fileinfo.type+'</td><td><a id="'+fid+'" class="btn btn-danger btn-xs" onclick = "deletef(\''+fileinfo.id+'\')"> Delete </a></td><td> <a id="'+fid+'" class="btn btn-info btn-xs" onclick = "downloadf(\''+fileinfo.id+'\')"> Download </a> </td></tr>');
                           $('loadlist').html(JSON.stringify(filelist));

                         }
                       }

                     xhrs.send(sparameters);
                 });
            });
       //}); //Signature parenthesis


      });
    }
  }
};

function generateRandAlphaNumStr(len) {
  /* Thank you stackoverflow */
  var rdmString = "";
  for( ; rdmString.length < len; rdmString  += Math.random().toString(36).substr(2));
  return  rdmString.substr(0, len);

}
