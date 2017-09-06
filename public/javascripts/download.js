function downloadf(fid) {

  var name = $('a.btn.btn-xs.btn-success').attr('name');
  var passphrase = document.getElementById("bloadlistform").elements[0].value;
  var keyfile = document.getElementById("bloadlistform").elements[1].files[0];
  var bpassphrase = document.getElementById("bp_"+name).value;


  getFileList(keyfile, passphrase, name, bpassphrase, function(data, privKeyObj, privKeyObj4, bpublic){

    var filelist = JSON.parse(data);

    // get file info
    var fileinfo = filelist.files.find(function(item, i){
               if(item.id === fid){
                 return i;
               }
             });
    filename = fileinfo.name+'.'+fileinfo.type;


     $('.loadlist').html('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile retrieved </span>');
     $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basefile decrypted </span>');
     $('.loadlist').append('<div class="row"><span class="glyphicon glyphicon-ok" aria-hidden="true"> Basket description decrypted </span>');
     $('.loadlist').append('<div class="row"><img src="/images/loadingq.gif" height="20" width="20" /> Downloading the chosen file </div>');


     var xhrs = new XMLHttpRequest();
     var p = ('fid='+fid);

     xhrs.open("POST", '/user/getfile', true);
     xhrs.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

     xhrs.onreadystatechange = function() {
       if (xhrs.readyState==4 && xhrs.status==200) {
         //Dovrebbe esserci una verifica della firma se la signature in upload avesse funzionato
         var enc = atob(JSON.parse(xhrs.responseText).filecontent);

         foptions = {
             message: openpgp.message.readArmored(enc),
             //publicKeys: openpgp.key.readArmored(pubkey).keys,    // for verification (optional)
             privateKey: privKeyObj4
         };

         openpgp.decrypt(foptions).then(function(plaintext) {
             var blob = dataURLtoBlob(plaintext.data);

             var reference = window.document.createElement('a');
             reference.href = window.URL.createObjectURL(blob);
             reference.download = filename;
             document.body.appendChild(reference);
             reference.click();
             document.body.removeChild(reference);

             $('.loadlist').html('');

         });
       }
     }
     xhrs.send(p);
  });

};

function dataURLtoBlob(dataurl) {
  /*Thank you stackoverflow, again*/
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
