var express = require('express')
  , logger = require('morgan')
  , app = express();

var path = require('path');

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/library', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
