var express = require('express');
var handlebars = require('express3-handlebars').create({defaultLayout:'main'});
var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//set the local host port
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
  res.render('home');
});

app.get('/about', (req, res)=>{
  res.render('about');
});

app.use(function(req, res, next){
  console.log('Looking for URL : ' + req.url);
  next();
});


app.listen(app.get('port'),()=>{
  console.log("express is working");
});
