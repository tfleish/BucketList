var http = require('http');
var sys = require('sys');
var fs = require('fs');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var rs = fs.createReadStream('index.html');
  sys.pump(rs, response);
  
}).listen(9316);
