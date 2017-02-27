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

function checkHashPassword(pass, salt) {
	var passwordData = sha512(pass, salt);
	return passwordData.passwordHash;
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
	console.log(req.body);
	var user = req.body.username;
	var pass = req.body.password;
	if (req.body.button == "Create") {
		console.log('Create entry');
		var passD = saltHashPassword(pass);
		var password = passD.passwordHash;
		var salt = passD.salt;
		var query = connection.query('INSERT INTO users (user, pass, salt) values (?, ?, ?)', [user, password, salt], function(err, result) {
			if (err) {
			} else {
				console.log('Created user');
				res.sendFile(__dirname + '/public/index.html');
			}
		});
	} else {
		connection.query('SELECT pass, salt from users where user = ?', user, function(err, result) {
			if (err) {
			} else {
				console.log("ELSE");
				console.log(result);
				var resultPass = result[0].pass;
				var resultSalt = result[0].salt;
				console.log("resultPass = " + resultPass);
				var passD = checkHashPassword(pass, resultSalt);
				console.log("passD = " + passD);
				if (passD == resultPass) {
					console.log('Success');
				} else {
					console.log('Unsuccessful');
				}
			}
		});
		console.log('Query');
		res.sendFile(__dirname + '/public/index.html');
	}
});

function saveQ(r) {
	resultQ = r;
}

app.listen(process.env.PORT || 3000, function () {
	console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
});
