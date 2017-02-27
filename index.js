'use strict';

var express = require('express')
  , logger = require('morgan')
  , app = express();

var bodyParser = require('body-parser');
var path = require('path');

var crypto = require('crypto');

var mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'GanadoR0626',
	database : 'library'
});

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/* Create Salt */
var genRandomString = function(length) {
	return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

/* Hash password with sha512 */
var sha512 = function(password, salt) {
	var hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	var value = hash.digest('hex');
	return {
		salt:salt,
		passwordHash:value
	};
};

/* Generate hash for storage in database */
function saltHashPassword(userpassword) {
	var salt = genRandomString(16); //Gives salt of length 16
	var passwordData = sha512(userpassword, salt);
	console.log('UserPassword = ' + userpassword);
	console.log('Passwordhash = ' + passwordData.passwordHash);
	console.log('nSalt = ' + passwordData.salt);
	return passwordData;
}

saltHashPassword('MYPASSWORD');
saltHashPassword('MYPASSWORD');

/* MYSQL server */
connection.connect(function(err) {
	//connected (unless 'err' is set
	console.log('connection err ' + err);
});

/* Server */
app.get('/library', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.post('/library/login', function (req, res) {
	console.log('Actual POST');
	var user = req.body.username;
	var passD = saltHashPassword(req.body.password);
	var pass = passD.passwordHash;
	var salt = passD.salt;
	console.log(user + " " + pass);
	var query = connection.query('SELECT * from users where user = ?', user, function(err, result) {
		console.log(err);
		console.log(result);
	});
	res.sendFile(__dirname + '/public/index.html');
	console.log(query.sql);
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
});
