var express = require('express');
var app = express.createServer();

app.configure(function(){
	app.use(express.bodyParser());
    app.use(express.static("./"));
});

app.get('/', function(req, res) {
	res.render('newIndex.html');
});

app.listen(8000);