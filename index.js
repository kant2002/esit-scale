require('dotenv').load();


var Redis      = require('redis');
var SerialBulk = require('./serialbulk');
var mysql      = require('promise-mysql');
var DB;



var redis = Redis.createClient();

var oldTime = new Date();


var serialPorts = [];
var serialRecord = {};
var lastRecord = {};

serialConfig = {
  parser: (!process.env.SERIAL) ? require("serialport").parsers.readline("\r") : 0,
  baudrate: 9600
};

  
var blankRow = {
  belt1: 0,
  belt2: 0, 
  belt3: 0, 
  belt4: 0, 
  beltCounter1: 0,
  beltCounter2: 0,
  beltCounter3: 0,
  beltCounter4: 0, 
  actualDate: new Date()
};


// ================================= RS 232: USB0    
// --------------------------------- serialPort1
serialPorts[0] = (!process.env.SERIAL) ? new require("serialport").SerialPort("/dev/ttyUSB0", serialConfig, false) : {connection: new SerialBulk(2307)};

//console.log(serialPorts[0]);

serialPorts[0].connection.open(function (error) {
  if (error) {
    console.log('SERIAL_PORT:RS232 connection failed: ',error);
  } else {
    console.log('SERIAL_PORT:RS232 success');

    var netMap = Array.apply(null, new Array(60)).map(Number.prototype.valueOf,0);;
    var speed = 0;
    var moment = new Date().getSeconds();
    var prevdata = 0;


    serialPorts[0].connection.on('data', function(data) {

      var act = new Date().getSeconds();
      
      if(prevdata == 0) prevdata = data;

      if(((act == 0) && (moment>act)) || (act>moment)){
        
        netMap.push(data - prevdata);
        netMap.shift();
        prevdata = data;
        moment = act;
        speed = (netMap.reduce(function(pv, cv) { return pv + cv; }, 0)/60)*3600;
        //console.log('------------------------------');
      }
      //console.log('data received: ',  data, ' prevdata: ', prevdata,' speed: ', speed);
      serialRecord['beltCounter'+1] = parseInt(data);
      redis.hmset("belt1", "counter", parseInt(data), "speed", speed, "name", "pgs");
    });
  }
});


mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
}).then(function(connection){
  DB = connection;
  return DB.query('SELECT * FROM yield ORDER BY id DESC LIMIT 1');
}).then(function(rows){
  lastRecord = (rows[0]) ? rows[0] : blankRow;
  console.log('DB_LAST: ',lastRecord);
  oldTime = new Date();
  wait();
}).catch(function(err){
  console.log('ERROR: ', err);
});


function wait() {
  setTimeout(function(){
    var time  = new Date();
    if((time - oldTime) > 1000*60*60){
      console.log('-save');
      redis.hmget(["belt1", "counter"], function (err, replies) {
        var record = {};
        record.beltCounter1 = parseInt(replies[0]);
        record.actualDate = time;
        save(record);
      });
    }else{
      console.log('-loop');
       wait();
    }
  }, 1000*60*4);
}

function save(record){
 
  console.log(lastRecord.beltCounter1, record.beltCounter1)
  if((lastRecord.beltCounter1 < record.beltCounter1)){
    console.log('NEW RECORD: ', record);
    record.belt1 = (lastRecord.beltCounter1) ? record.beltCounter1 - lastRecord.beltCounter1 : 0;
    DB.query('INSERT INTO yield SET ?', record).then(function(){
      lastRecord = record;
      oldTime = record.actualDate;
      wait();
    })
  } else{
    console.log('NO CHANGES: ', record.actualDate);
    oldTime = record.actualDate;
    wait();
  }
  
}




