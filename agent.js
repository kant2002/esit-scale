
var Mongoose   = require('mongoose');
var SerialPort = require("serialport").SerialPort;
var redis      = require('redis').createClient();


var db_name = 'test';  //further performing config variables


Mongoose.connect('mongodb://localhost/'+db_name, function(error) {
    if (error) {
    	console.log('MONGODB:'+db_name+' could not connect to server '+error);
    } else{
    	console.log('MONGODB:'+db_name+' connection estabilished');
    }
});


// Daily report document-scheme of scale index
var ScaleReportSchema = Mongoose.Schema({  
	_id: String,
	register_time: Date,
	update_time: Number,
	hourly: Object
});

var scaleMetrics = Mongoose.model('rep', ScaleReportSchema);

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


// scaleMetrics.findOne({}, null, {sort: {register_time: -1 }}, function(error, post){
// 	if(error){
// 		console.log('Last Record Not Found');
// 	}
// 	else{
// 		console.log('Last Record', post);
// 	}
// });


// var serialPort = new SerialPort("/dev/tty.wchusbserial1410", {
//   baudrate: 115200
// }, false); 


// serialPort.open(function (error) {
//   if (error) {
//     console.log('SERIAL_PORT:RS232 connection failed: '+error);
//   } else {
//     console.log('SERIAL_PORT:RS232 success');

//     serialPort.on('data', function(data) {
//     	console.log('data received: ' + data);
//     });
   
// 	serialPort.write("A", function(err, results) {
// 		console.log('err ' + err);
// 		console.log('results ' + results.toString(16));
// 	}); 
//   }
// });






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

		var inc = { $inc: {} };
		inc.$inc['hourly.' + virual_hour+'.counter'] = counter;
		inc.$inc['hourly.' + virual_hour+'.bulk'] = bulk;
		inc.register_time = register_str;
		inc.update_time = virual_hour;
		scaleMetrics.findOneAndUpdate({
			register_time: {"$gte": new Date(2015, month, virual_day)}
		}, inc, {upsert: true, sort: {"register_time": -1}}, function(err, post){
			if(!post){

				console.log('NEW DAY');
			}
			else{

				//console.log(post);
				console.log('COUNTER: ', bulk, counter);
			}

			//console.log('==============================================');
		});
	}


	
	console.log('----------------------------------------------');
	


}, 500);





