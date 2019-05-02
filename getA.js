
var fs = require('fs')
var mysql=require('mysql')
var request = require('request');
var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'12345',
   port:'3306',
   database:'test'

});


connection.connect(function(err){
    if (err){
        console.log(err);
        return;
    }

    console.log('succeed!')
});



var count=0;
var pp=setInterval(function(){  
 count++;
var querydata=[count]
connection.query('SELECT * FROM latlng AS n WHERE n.`id` = ?',querydata,function(err,rows,fields){
    if (err){
        console.log(err);
        return;
    }
  console.log('succeed!')
  //console.log(rows[0].lng)
 var lat=rows[0].lat;
 var lng=rows[0].lng;

  var apiUri="http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location="+lng+","+lat+"&output=json&pois=0&ak=WUPGAouSp0YkG7yA6upSBlnL";

  request({　　
    　　　　url: apiUri,
    　　　　method: 'GET',
    　　　　json: true,
          },callback)
});


function callback(error, response, data) {
   // console.log(data)
    var str=data.split('renderReverse&&renderReverse')[1];
     str=str.substring(1,str.length-1);
     console.log(str)
    var json=JSON.parse(str)
    var address=json.result.formatted_address;
    var classs=json.result.business;
    console.log('------地址------'+address+'------区域------'+classs);
  　updata(address,classs,count);
}

function updata(address,classs,count){
    var updateData=[address,classs,count]
    connection.query('UPDATE latlng SET address=?,class=? WHERE id=?',updateData,function(err,rows,fields){
        if (err){
            console.log(err);
            return;
        }
      console.log('succeed!')
     
    });
}

}, 500);
