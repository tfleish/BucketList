/*
var http = require('http');
var sys = require('sys');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var rs = fs.createReadStream('index.html');
  sys.pump(rs, response);

}).listen(9316);
*/


var express = require('express');
var app = express.createServer();

app.configure(function(){
	app.use(express.bodyParser());
    app.use(express.static("./"));
});

app.get('/', function(req, res) {
	res.render('newIndex.html');
});

app.listen(9316);