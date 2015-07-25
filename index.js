
var SerialPort = require("serialport").SerialPort;
var Redis      = require('redis');
var Sequelize  = require("sequelize");
//require connection config




var sequelize = new Sequelize('scale_agent', 'homestead', 'secret', {
  host: 'localhost',
  dialect: 'mysql',
});

var redis = Redis.createClient();


var BeltScale = sequelize.define('belt_scale', {
  registerTime: {
  	type: Sequelize.DATE,
  	field: 'register_time'
  },
  scaleName1: {
  	type: Sequelize.STRING,
  	field: 'scale1_name'
  },
  scaleAmount1: {
    type: Sequelize.INTEGER,
    field: 'scale1_amount'
  },
  scaleCounter1: {
  	type: Sequelize.INTEGER,
    field: 'scale1_counter'
  },
  scaleName2: {
  	type: Sequelize.STRING,
  	field: 'scale2_name'
  },
  scaleAmount2: {
    type: Sequelize.INTEGER,
    field: 'scale2_amount'
  },
  scaleCounter2: {
  	type: Sequelize.INTEGER,
    field: 'scale2_counter'
  },
  scaleName3: {
  	type: Sequelize.STRING,
  	field: 'scale3_name'
  },
  scaleAmount3: {
    type: Sequelize.INTEGER,
    field: 'scale3_amount'
  },
  scaleCounter3: {
  	type: Sequelize.INTEGER,
    field: 'scale3_counter'
  },
  scaleName4: {
  	type: Sequelize.STRING,
  	field: 'scale4_name'
  },
  scaleAmount4: {
    type: Sequelize.INTEGER,
    field: 'scale4_amount'
  },
  scaleCounter4: {
  	type: Sequelize.INTEGER,
    field: 'scale4_counter'
  }

}, {
	timestamps: false,
	freezeTableName: true // Model tableName will be the same as the model name
});

BeltScale.sync().then(function () {
  // Table created
 	console.log('BeltScale Table Created');
});


var date = new Date();
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();
var second = date.getSeconds();
var year = date.getFullYear();


var counter = 49300;
var oldcounter = 49230; //
var olddate = new Date();
var date, bulk;

var prev_time, prev_counter, speed;

var houe_diff;

var serialPort = new SerialPort("/dev/tty.wchusbserial1410", {
  baudrate: 115200
}, false); 


serialPort.open(function (error) {
  if (error) {
    console.log('SERIAL_PORT:RS232 connection failed: '+error);
  } else {
    console.log('SERIAL_PORT:RS232 success');

    serialPort.on('data', function(data) {
      console.log('data received: ' + data);

      counter = data;

      bulk = counter-oldcounter;
      date = new Date();
      
      day = date.getDate();
      month = date.getMonth();
      hour = date.getHours();
      minute = date.getMinutes();
      second = date.getSeconds();
      year = date.getFullYear();

      hour_diff = date - olddate;


      var register_str = new Date();
      register_str.setMinutes(0);
      register_str.setSeconds(0);
      register_str.setMilliseconds(0);

      console.log(register_str);


      if(counter-prev_counter){
       prev_counter = counter;
       speed = 360000/(date - prev_time);   //Tonn Hour Interpolation
       prev_time = date;
      }


      redis.hmset("scale1", "speed", speed, "counter", counter, "name", "pgs");

      // redis.hmget(["scale1", "name", "counter", "speed"], function (err, replies) {
          
      //     replies.forEach(function (reply, i) {
      //         console.log("    " + i + ": " + reply);
      //     });
      //     //redis.quit();
      // });


      // Per-hour document record

      if(hour_diff>=3600000){

        olddate = date;
        oldcounter = counter; 

        var indicator = {};

        indicator.scaleName1 = "PGS";
        indicator.scaleCounter1 = counter;
        indicator.scaleAmount1 = bulk;
        indicator.registerTime = register_str;
        // inc.update_time = virual_hour;
        
        

        BeltScale.create(indicator).then(function(indication) {
          // console.log(indication);
        })
      
      }




    });
   
  // serialPort.write("A", function(err, results) {
  //   console.log('err ' + err);
  //   console.log('results ' + results.toString(16));
  // }); 
  }
});


