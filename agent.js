
var SerialPort = require("serialport").SerialPort;
var Redis      = require('redis');
var Sequelize  = require("sequelize");
//require connection config




var sequelize = new Sequelize('scale_agent', 'homestead', 'secret', {
  host: '192.168.10.10',
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

var inc = { $inc: {} };
inc.$inc['hourly.' + second+'.counter'] = 0;
inc.$inc['hourly.' + second+'.bulk'] = 0;

var counter = 49300;
var oldcounter = 49230; //
var olddate = new Date();
var bulk;



setInterval(function(){

	counter+=Math.round(Math.abs(Math.random()-0.3));
	

	bulk = counter-oldcounter;
	

	date = new Date();
	
	day = date.getDate();
	month = date.getMonth();
	hour = date.getHours();
	minute = date.getMinutes();
	second = date.getSeconds();
	year = date.getFullYear();

	var date_diff = date - olddate;


	var register_str = new Date();


	var virual_day = (minute>30) ? minute-30 : minute;  
	var virual_hour = Math.floor(second/2.5);

	register_str.setDate(virual_day);
	register_str.setHours(virual_hour);
	register_str.setMinutes(0);
	register_str.setSeconds(0);
	register_str.setMilliseconds(0);

	console.log(register_str);

	
	// console.log(register_str);
	// console.log(new Date(2015, month, virual_day));

	

	


	// if(counter-prev_counter){
	// 	prev_counter = counter;
	// 	speed = 360000/(date - prev_time);   //Tonn Hour Interpolation
	// 	prev_time = date;
	// }


	// redis.rpush('scale:counter', counter);

	// multi = redis.multi();
    
	 //    multi.llen("crusher");
	 //    multi.lrange('crusher', 0, 10);

	// multi.exec(function (err, replies) {

	// 	if(replies[0]>10){
	// 		console.log('need delete');
	// 		redis.lpop('crusher');
	// 	} else{
	// 		console.log('filling');
	// 	}
       

 //        var total = 0;
 //        for(var i=0; i<10; i++){
 //        	total+=parseInt(replies[1][i]);
 //        }
 //        console.log(replies[1]); //Arithmetic Mean
        
    // });


	// Per-hour document record

	if(date_diff>=2500){

		
		
	
		olddate = date;
		oldcounter = counter;	

		var indicator = {};

		indicator.scaleName1 = "PGS";
		indicator.scaleCounter1 = counter;
		indicator.scaleAmount1 = bulk;
		indicator.registerTime = register_str;
		// inc.update_time = virual_hour;
		
		redis.hmset("scale1", "speed", 1, "counter", counter, "name", "pgs");



    	// redis.hmget(["scale1", "name", "counter", "speed"], function (err, replies) {
	        
	    //     replies.forEach(function (reply, i) {
	    //         console.log("    " + i + ": " + reply);
	    //     });
	    //     //redis.quit();
	    // });

		BeltScale.create(indicator).then(function(indication) {
			// console.log(indication);
		})
	
	}


	
	console.log('----------------------------------------------');
	


}, 500);
