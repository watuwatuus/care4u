var bodyParser = require('body-parser');
var express = require('express');
var app = express();

var redis = require('redis');
var client = redis.createClient();
client.on('connect', function(){
    console.log('connected');
});


app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

 client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

client.hgetall('frameworks', function(err, object) {
   if (err) {
    console.error('There was an error reading the file!', err);
    return;
  }
    console.log(object);
});

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.get('/', function(request, response) {
//  response.render('pages/index');
//});

app.post('/api/new-user', function(req, res) {
    console.log(req.body.pet_type);
    var redis = require('redis');
    var client = redis.createClient();
    client.on('connect', function() {
	console.log('connected');
    });

    pet_id = client.incr("next_pet_id", function(err, reply){
	console.log(err);
	console.log(reply);
    });
    client.hmset('PETS:'+pet_id.toString(), 'pet_name', req.body.pet_name, "pet_type"
		 ,req.body.pet_type, function(err, reply) {
		     console.log(reply); // 3
		     console.log(err);
		 });
    client.hget('PETS:'+pet_id.toString(), "pet_name", function(err, reply){
	if(err){ console.log(err);}
	console.log(reply);
    });
    
   // client.rpush(['pets',
//		  JSON.stringify({
//		      'pet_name' : req.body.pet_name,
//		      'pet_type':  req.body.pet_type
//		  })], function(err, reply) {
//		     console.log(reply); // 3
//		 });
  //  client.lrange('pets', -1 , -1, function(err,reply){
//	console.log(reply);
 //   })
    res.send()
});

app.get('/api/*', function(req, res) {
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


