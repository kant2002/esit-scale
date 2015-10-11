var EventEmitter = require('events').EventEmitter;
var Random = require("random-js");
var random = new Random(Random.engines.mt19937().autoSeed());


function SerialBulk(counter) {
  var self = this;

  this.distDays = [];
  this.counter = counter;
  this.oldcounter = counter;
  this.cc = 0;
}

SerialBulk.prototype = new EventEmitter();

SerialBulk.prototype.start = function(){
	console.log('Bulk Starting');
};

SerialBulk.prototype.open = function(callback){

  var self = this;

  console.log('Connection Opened');

  this.setDistributions();

  setInterval(function(){
    var now = new Date();
    var inc = random.integer(self.distDays[now.getDOY()].min, self.distDays[now.getDOY()].max)/7200;
    self.counter += inc;

    // self.cc++;
    // if(self.cc >= 7200){
    //   self.cc = 0;
    //   console.log('Total by Hour : ', self.counter - self.oldcounter, ' ', self.distDays[now.getDOY()].min, self.distDays[now.getDOY()].max);
    //   self.oldcounter = self.counter;
    // }

    self.emit('data', Math.round(self.counter));
  }, 400);

  callback.call(this);

};

SerialBulk.prototype.setDistributions = function(){
  for(var i = 0; i< 365; i++){
    this.distDays[i] = {min: random.integer(200, 400), max: random.integer(400, 800)};
  }
};

Date.prototype.getDOY = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((this - onejan) / 86400000);
}


// SerialBulk.prototype.bulkify = function (begin, end) {
//   console.log('Generating Bulk Data'.white);
//   var self = this;

//   device = {
    
//   }

//    '192.168.10.10';
//   device.db.mysql = {username: 'homestead' ,password: 'secret' , database: 'esit-store'};

//   var connection = this.utils.mysql.createConnection({
//     host     : device.vpnIp,
//     port     : device.db.mysql.port || 3306,
//     user     : device.db.mysql.username,
//     password : device.db.mysql.password,
//     database : device.db.mysql.database
//   });

//   connection.connect();


//   table.columns.add('scopeId', this.utils.sql.Int, {nullable: false});
//   table.columns.add('belt1', this.utils.sql.Int, {nullable: true});
//   table.columns.add('belt2', this.utils.sql.Int, {nullable: true});
//   table.columns.add('belt3', this.utils.sql.Int, {nullable: true});
//   table.columns.add('belt4', this.utils.sql.Int, {nullable: true});
//   table.columns.add('beltCounter1', this.utils.sql.Int, {nullable: true});
//   table.columns.add('beltCounter2', this.utils.sql.Int, {nullable: true});
//   table.columns.add('beltCounter3', this.utils.sql.Int, {nullable: true});
//   table.columns.add('beltCounter4', this.utils.sql.Int, {nullable: true});
//   table.columns.add('actualDate', this.utils.sql.DateTime2, {nullable: false});

//   var scopeId = 14;
//   var belt = [58932, 0, 0, 0];
//   var startHour = 8;
//   var finishHour = 19;

//   var bDate = new Date(begin);
//   var eDate = new Date(end);

 



//   var sql = "INSERT INTO Test (name, email, n) VALUES ?";
//   var values = [];


//    while(bDate <= eDate){
//     bDate.setDate(bDate.getDate()+1);
//     var rmin = random.integer(20, 40);
//     var rmax = random.integer(40, 80)

//     if(bDate.getDay() != 6){
//       for( var h = startHour; h < finishHour; h++){

//         var d = ((h == 12) || (h==13)) ? 4 : 1;

//         var r1 = (belt[0]) ? Math.ceil(random.integer(rmin, rmax)/d) : 0;
//         var r2 = (belt[1]) ? Math.ceil(random.integer(rmin, rmax)/d) : 0;
//         var r3 = (belt[2]) ? Math.ceil(random.integer(rmin, rmax)/d) : 0;
//         var r4 = (belt[3]) ? Math.ceil(random.integer(rmin, rmax)/d) : 0;

//         belt[0] += r1;
//         belt[1] += r2;
//         belt[2] += r3;
//         belt[3] += r4;

//         var actualDate = new Date(bDate.setHours(h));
//         // console.log(new Date(actualDate).toLocaleString(), ' - ', r1);
//         values.push([scopeId, r1, r2, r3, r4, belt[0], belt[1], belt[2], belt[3], actualDate]);
//      }
//     }
//   }

//   conn.query(sql, [values], function(err) {
//       if (err) throw err;
//       conn.end();
//   });

// };


module.exports = SerialBulk;