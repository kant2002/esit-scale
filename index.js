
var SerialPort = require("serialport").SerialPort;
var Redis      = require('redis');
var mysql      = require('promise-mysql');
var DB;

mysql.createConnection({
  host: '192.168.0.103',
  user: 'esitagent',
  password: 'esitsqlsecret',
  database: 'scale_agent'
}).then(function(conn){
  DB = conn;
}); 

var redis = Redis.createClient();


var oldTime = new Date();
var lastResults;
// var day = date.getDate();
// var hour = date.getHours();
// var minute = date.getMinutes();
// var second = date.getSeconds();
// var year = date.getFullYear();




var counter = 49300;
var oldcounter = 49230; //
var olddate = new Date();
var date, bulk;

var prev_time, prev_counter, speed;

var houe_diff;

// ================================= RS 232: USB0    
// --------------------------------- serialPort1

var serialPort1 = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600
}, false); 


DB.query('SELECT * FROM yield ORDER BY id DESC LIMIT 1').then(function(rows){
  lastResults = rows[0];
  console.log(lastResults);

  serialPort1.open(function (error) {
    if (error) {
      console.log('SERIAL_PORT:RS232 connection failed: ',error);
    } else {
      console.log('SERIAL_PORT:RS232 success');

      serialPort1.on('data', function(data) {
        console.log('data received: ' + data);


        if(data == lastResults.beltCounter1){
          console.log('NO UPDATES');
        }
        else{
          console.log('NEW COUNTER DATA: ' + data)
        }
      });
    }
  });
}).catch(function(err){
  console.log('ERROR: ', err);
});

// var serialPort1 = new SerialPort("/dev/ttyUSB0", {
//   baudrate: 9600
// }, false); 

// serialPort1.open(function (error) {
//   if (error) {
//     console.log('SERIAL_PORT:RS232 connection failed: ',error);
//   } else {
//     console.log('SERIAL_PORT:RS232 success');

//     serialPort1.on('data', function(data) {
//       console.log('data received: ' + data);


//       if(data == lastResults.beltCounter1){
//         console.log('NO UPDATES');
//       }
//       else{
//         console.log('NEW COUNTER DATA: ' + data)
//       }

      // counter = data;
      // bulk = counter-oldcounter;
      
      // date = new Date();
      
      // day = date.getDate();
      // month = date.getMonth();
      // hour = date.getHours();
      // minute = date.getMinutes();
      // second = date.getSeconds();
      // year = date.getFullYear();

      // hour_diff = date - olddate;


      // var register_str = new Date();
      // register_str.setMinutes(0);
      // register_str.setSeconds(0);
      // register_str.setMilliseconds(0);

      // console.log(register_str);


      // if(counter-prev_counter){
      //  prev_counter = counter;
      //  speed = 360000/(date - prev_time);   //Tonn Hour Interpolation
      //  prev_time = date;
      // }


      // redis.hmset("scale1", "speed", speed, "counter", counter, "name", "pgs");

      // redis.hmget(["scale1", "name", "counter", "speed"], function (err, replies) {
          
      //     replies.forEach(function (reply, i) {
      //         console.log("    " + i + ": " + reply);
      //     });
      //     //redis.quit();
      // });


      // Per-hour document record

      // if(hour_diff>=3600000){

      //   olddate = date;
      //   oldcounter = counter; 

      //   var indicator = {};

      //   indicator.scaleName1 = "PGS";
      //   indicator.scaleCounter1 = counter;
      //   indicator.scaleAmount1 = bulk;
      //   indicator.registerTime = register_str;
      //   // inc.update_time = virual_hour;
        
        

      //   BeltScale.create(indicator).then(function(indication) {
      //     // console.log(indication);
      //   })
      
      // }

      // if(date - olddate){
      //   olddate = date;
      // }




    // });
   
  // serialPort.write("A", function(err, results) {
  //   console.log('err ' + err);
  //   console.log('results ' + results.toString(16));
  // }); 
  // }
// });


