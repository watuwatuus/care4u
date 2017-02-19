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
client.on('connect', function() {
    console.log('connected');
});

/* client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

client.hgetall('frameworks', function(err, object) {
   if (err) {
    console.error('There was an error reading the file!', err);
    return;
  }
    console.log(object);
});*/

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//app.get('/', function(request, response) {
//  response.render('pages/index');
//});

app.post('/api/list-users', function(req, res) {
    console.log("here");
    var last_user_id;
    
    client.get("next_user_id", function(err, reply){

	if(err){
	    return;
	}
	last_user_id = reply;
	
	console.log(last_user_id);
	var result = [];
	var counter = 0;
	for(i=last_user_id;i >= 0; i--){
	    multi = client.multi();
	    multi.hgetall("user:"+i); //function( err, reply){
	    //multi.hmget("user:"+i, "email"); //function( err, reply){
	    multi.lrange("user_education:"+i,0,-1);

	    multi.exec(function (err, replies) {
		//console.log("exec");
		counter++;
		userDataFetched = true;
		//console.log(JSON.stringify(replies)); // 101, 2
		tt = replies;
		console.log(replies);
		if(!err){
		    var temp = {};
		    temp.profile = replies[0];
		    temp.education = replies[1].map(function(d) {
			console.log(d);
			//console.log(JSON.parse(d));
			return JSON.parse(d);
		    });
		    //console.log(temp);
		    if(replies[0] != null)
			result.push(temp);
		}
		if(counter == last_user_id){
		    console.log(result);
		    res.json(result);
		}
		//res.end();
	    });
	    
	}
	//res.setHeader('Content-Type', 'application/json');
        //
	//res.write(reply);
        //res.end();
	//res.send(JSON.stringify(users_list));
	
    });
});

/*app.post('/api/new-class', function(req, res){
    client.incr("next_class_id", function(err, reply){
	if(err){
	    res.status(500).send("next_class_id not found");
	    return;
	}
	class_id = reply;
	class_title = req.body.class_title;
	class_category = req.body.class_category;
	class_description = res.body.class_description;
	lessons = res.body.lessons;
	
	client.rpush("Classes:"+class_id, class_title, lessons, function(err, reply){
	    if(err){
		return;
	    }
	    

	});

	
    });
});*/

app.post('/api/new-user', function(req, res) {
    //var redis = require('redis');
    //var client = redis.createClient();

    var user_id;
    client.incr("next_user_id", function(err,reply){
	if(err){
	    res.status(500).send("next_user_id not found");
	    return;
	}
	user_id = reply;
	

	console.log(req.body.user_name);
	client.hmset('user:'+user_id, "name", req.body.user_name, "email", req.body.user_email,function(err, reply){if(err) console.log(err) });
	
	for(var i=0; i< req.body.educations.length; i++){
	    //console.log(req.body.educations[i]);
	    client.rpush('user_education:' + user_id, JSON.stringify(req.body.educations[i]));
	}
	
	console.log(user_id);
	for(i=user_id-3;i<user_id; i++){	
	    client.lrange('user_education:'+ i, 0, -1, function(err, reply){
		if(err)
		    console.log(err);
		else
		    console.log(reply);
	    }) 
	}
    });

//    }
    
    //client.rpush('user_pets:'+user_id, pet_id);
							    
    //client.hmset('PETS:'+pet_id.toString(), "user_id", user_id, 'pet_name', req.body.pet_name, "pet_type"
//		 ,req.body.pet_type, function(err, reply) {
//		     console.log(reply); // 3
//		     console.log(err);
//		 });
//    client.hget('PETS:'+pet_id.toString(), "pet_name", function(err, reply){
//	if(err){ console.log(err);}
//	console.log(reply);
//    });
    
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

app.get('/src/*', function(req, res) {
    res.status(500);
});


app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


