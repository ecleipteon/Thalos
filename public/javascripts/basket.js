$(document).ready(function() {

  $('[data-toggle="tooltip"]').tooltip()

  $('.filepanel').fadeOut();


  $(".lbuttt").click(function() {
     bloadlist();
  });
});


function bloadlist() {
  $('.basket_table').html('');
  var passphrase = document.getElementById("bloadlistform").elements[0].value;
  var keyfile = document.getElementById("bloadlistform").elements[1].files[0];

  getBasketList(keyfile, passphrase, function(data) {
    var basketlist = JSON.parse(data);
    for (i = 0; i < basketlist.baskets.length; i++) {

       if(basketlist.baskets[i].name != '0') {
         var n =  basketlist.baskets[i].name.split("_");
         $('.basket_table').append('<tr>');
         $('.basket_table').append('<td>'+n[0]+'</td>');
         $('.basket_table').append('100 MB');
         $('.basket_table').append('<td><input class="form-control" id="bp_'+n[0]+'" name="bpassphrase" type="password" placeholder="Basket passphrase">');
         $('.basket_table').append('</td>');
         $('.basket_table').append('<td><a class="btn btn-success" title="Open basket" onclick = "openbasket(\''+n[0]+'\')" > Open it! </a></td>');
         $('.basket_table').append('<td><a class="btn btn-success" title="Delete" onclick = "deletebasket(\''+n[0]+'\')" > Delete </a></td>');
         $('.basket_table').append('</tr>');
       }
    }

    $('.loadlist').html('' );


    delete plaintext;
    delete basketlist;
    delete passphrase;
    delete privatekey;
    delete keyfile;
    delete privKeyObj;

  });
}

function openbasket(name) {
  var passphrase = document.getElementById("bloadlistform").elements[0].value;
  var keyfile = document.getElementById("bloadlistform").elements[1].files[0];
  var bpassphrase = document.getElementById("bp_"+name).value;

  getFileList(keyfile, passphrase, name, bpassphrase, function(sfilelist) {
    var filelist = JSON.parse(sfilelist);

    //$('.loadlist').html(JSON.stringify(filelist));
    $('.filepanel').fadeIn();
    $('.paneltitle').html('Basket '+name+' opened');
    $('a.btn.btn-xs.btn-success').attr('name', name);

    for(i = 0; i<filelist.files.length; i++ )
       $('.filetable').append('<tr><td>'+filelist.files[i].name+'</td><td>'+filelist.files[i].filesize+'</td><td>'+filelist.files[i].type+'</td><td><a id="'+filelist.files[i].id+'" class="btn btn-danger btn-xs" onclick = "deletef(\''+filelist.files[i].id+'\')"> Delete </a></td><td> <a id="'+filelist.files[i].id+'" class="btn btn-info btn-xs" onclick = "downloadf(\''+filelist.files[i].id+'\')"> Download </a> </td></tr>');

  });

};
