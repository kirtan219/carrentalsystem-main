const express = require('express');
const session = require('express-session');							
const passport = require('passport');								
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
const app = express();
var port = process.env.PORT || 8080;
app.use(session({
	secret: '123456',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

passport.use(new WebAppStrategy({
	tenantId: "5fb6b9e7-dd68-4a97-81a9-194c48c88be5",
	clientId: "89a02320-2e0f-4960-8fed-b809778384e7",
	secret: "YjVjNGI4MTItZjMzNC00NDlmLTkzZTgtNTFhZWU1OGFjODZm",
	oauthServerUrl: "https://au-syd.appid.cloud.ibm.com/oauth/v4/5fb6b9e7-dd68-4a97-81a9-194c48c88be5",
	redirectUri: "https://patelproject.1e7x09ugpu68.au-syd.codeengine.appdomain.cloud:8080/appid/callback",
}));


app.get('/appid/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
	successRedirect: '/',
	forceLogin: true
}));

//
// Handle callback
app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME, { keepSessionInfo: true }));
//app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME));
app.use('/api', (req, res, next) => {
	if (req.user){
		next();
	} else {
		res.status(401).send("Unauthorized");
	}
});

app.get('/api/user', (req, res) => {
	//console.log(res);
console.log(req.session[WebAppStrategy.AUTH_CONTEXT]);
	res.json({
		user: {
			name: req.user.name
		}
	});
 
});


app.get("/appid/logout", function(req, res) {
	req.logout(function(err) {
	  if (err) { console.log(err); }
	  res.redirect("/");
	});
  });




// Serve static resources

app.use(express.static('./public'));
app.listen(port);














var port2 = 8001

var Cloudant = require('@cloudant/cloudant');
var url = "https://apikey-v2-1rbquh4lbloh8r6pmtyb802wotxs86k3vcdmqwwpwonj:fa11735420bc8686e7ddc948a8e1b291@0cc1d4cf-b2e7-44a5-8824-a6f3d998e1ac-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-1rbquh4lbloh8r6pmtyb802wotxs86k3vcdmqwwpwonj";
var password = "fa11735420bc8686e7ddc948a8e1b291";
var app2 = express();
const bodyParser = require('body-parser');
//const cors = require('cors');
//app2.use(cors());
// Configuring body parser middleware
app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());
/////////////
// app2.get('/', function (req, res) {
//   res.send("Welcome to cloudant database on IBM Cloud");
// });

app2.use(express.static("./cloudant"))

//////////


app2.get('/list_of_databases', function (req, res) {

  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ...

    // Lists all the databases.
    cloudant.db.list().then((body) => {
      res.send(body);
    }).catch((err) => { res.send(err); });
  });
});

///////////////  create database
app2.post('/create-database', (req, res) => {
  var name = req.body.name;
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ...

    cloudant.db.create(name, (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send("database created")

      }
    });
  });
});




////////////// insert single document
app2.post('/insert-document', function (req, res) {
  var id, name, email, pickup, dropoff, date;

  database_name = req.body.db;
  id = req.body.id,
  name = req.body.name;
  email = req.body.email;
  pickup= req.body.pickup;
  dropoff= req.body.dropoff;
  date= req.body.date;

  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ..

    cloudant.use(database_name).insert({ "name": name, "email": email,"pickup":pickup,"dropoff":dropoff,"date":date }, id, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data); // { ok: true, id: 'rabbit', ...
      }
    });
  });
});





/////   insert bulk documents
app2.post('/insert-bulk/:database_name', function (req, res) {
  var _id, name, address, phone, age;
  //var database_name;
  var database_name1 = req.params.database_name;

  for (var i = 0; i < 3; i++) {

    var student =
    {
      _id: req.body.docs[i].id,
      name: req.body.docs[i].name,
      address: req.body.docs[i].address,
      phone: req.body.docs[i].phone,
      age: req.body.docs[i].age,
    }
    //console.log(student);



    students.push(student);


  }

  console.log(students);
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ..

    cloudant.use(database_name1).bulk({ docs: students }, function (err) {
      if (err) {
        throw err;
      }

      res.send('Inserted all documents');
    });
  });
});









//////////////// delete a document
app2.delete('/delete-document', function (req, res) {
  var id, rev, database_name;
  database_name = req.body.db;
  id = req.body.id;
  rev = req.body.rev;
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ..

    cloudant.use(database_name).destroy(id, rev, function (err) {
      if (err) {
        throw err;
      }

      res.send('document deleted');
    });
  });
});

////////////////






//////////////// update existing document
app2.put('/update-document', function (req, res) {
  var id, rev, database_name;
  database_name = req.body.db;
  id = req.body.id;
  rev = req.body.rev;
  name = req.body.name;
  address = req.body.address;
  phone = req.body.phone;
  age = req.body.age;
  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
    if (err) {
      return console.log('Failed to initialize Cloudant: ' + err.message);
    }
    console.log(pong); // {"couchdb":"Welcome","version": ..

    cloudant.use(database_name).insert({ _id: id, _rev: rev, "name": name, "age": age, "address": address, "phone": phone }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data); // { ok: true, id: 'rabbit', ...
      }
    });
  });
});

app2.listen(port2, () => {
  console.log("server is running on port : " + port2)
});