//server.js

//call the packages we need
var express = require('express'),
    soundLocations = require('./routes/soundLocations');

//define app using express
var app = express();

//configure our app to use bodyParser() and logger()
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//routes to API 
app.get('/soundLocation', soundLocations.findAll);
app.get('/soundLocation/:id', soundLocations.findById);
app.post('/soundLocation', soundLocations.addSoundLocation);
app.delete('/soundLocation/:id', soundLocations.deleteSoundLocation);
app.delete('/soundLocation', soundLocations.deleteAll);

//START SERVER
app.listen(3000);
console.log('Listening on port 3000...');
