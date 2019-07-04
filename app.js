const express = require('express');
const app = express();
const port = 3000;
var path = require('path');

//var session = require('express-session');
//var bodyParser = require('body-parser');
//var path = require('path');

var mysql = require('mysql');

//Let Express know we are using some packages
//app.use(session({
//	secret: 'secret',
//	resave: true,
//	saveUninitialized: true
//}));

//app.use(bodyParser.urlencoded({extended : true}));
//app.use(bodyParser.json());

//app.get('/', (req, res) => res.send('Hello World!'))

app.use('/static', express.static('public'));
//app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

//app.get('/styles/style.css', (req, res) => res.sendFile(path.join(__dirname + '/public/styles/style.css')));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//Create Connection to MYSQL Server
var connection = mysql.createConnection({
	host	: 'localhost',
	database: 'library',
	user	: 'rofel',
	password: 'GanadoR0626',
});

//Connect to MYSQL Server
connection.connect(function(err) {
	if (err) {
		console.error('Error connecting: ' + err.stack);
		return;
	}

	console.log('Connected to MySQL as id ' + connection.threadId);
});

//Dummy query
//connection.query('SELECT * FROM employee, function (error, results, fields) {
//	if (error)
//		throw error;
//
//	results.forEach(result => {
//		console.log(result);
//	});
//});
