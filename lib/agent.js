
var EventEmitter = require('events').EventEmitter;

var EsitScale = require('../lib/esit');
//var Log = require('../lib/database').Log;


function Server() {
  this.esitScale = new EsitScale(); 
  //this.log = new Log();
  
}

Server.prototype = new EventEmitter();

Server.prototype.start = function () {

  var self = this;


 


	this.esitScale.on('detect', function (scale) {
		console.log('detect');
	
  	});
  console.log('Esit Agent started');
  //this.esitScale
};

  module.exports = new Server();