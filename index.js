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

var lat=116.403847//(经度)
var lng=39.915526//(纬度)

var lat_east_limit=121.6669605737
var lat_west_limit=121.1301323684

var lng_north_limit=31.3796868959
var lng_south_limit=30.9897463695
var lat_data=[]
var lng_data=[]

var lat_init_x=lat_west_limit;
do
  {
    lat_init_x+=0.001;
    lat_data.push(lat_init_x.toFixed(6));
  }
while (lat_init_x<lat_east_limit);
console.log(lat_data.length);

var lng_init_x=lng_south_limit;
do
  {
    lng_init_x+=0.0001;
    lng_data.push(lng_init_x.toFixed(6));
  }
while (lng_init_x<lng_north_limit);
console.log(lng_data.length);

connection.connect(function(err){
    if (err){
        console.log(err);
        return;
    }
    console.log('succeed!')
});

var json=[];

var latindex=0;
var lngindex=0;
var count=0;
var pp=setInterval(function(){  
 count++;
 console.log('次数：'+count);
 lngindex++;

 if (lngindex>lng_data.length-1){
    latindex++;
    lngindex=0;
}
//json.push({'lng':lng_data[lngindex], 'lat':lat_data[latindex]});


var sqldata=[parseFloat(lat_data[latindex]),parseFloat(lng_data[lngindex])]
connection.query('INSERT INTO latlng (lat,lng) VALUES (?, ?)',sqldata,function(err,rows,fields){

    if (err){
        console.log(err);
        return;
    }
  console.log('succeed!')
});

console.log('lat当前索引：'+latindex);
console.log('lng当前索引：'+lngindex);

 if (count>lat_data.length*lng_data.length){
    connection.end(function(err){
        if (err){
            return;
        }
        console.log('succeed!')
       });

    console.log(json)
 clearInterval(pp);
 }
   

}, 200);


