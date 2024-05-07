var express = require('express');

var PORT;
var Cloudant = require('@cloudant/cloudant');


if (process.env.PORT) {
  PORT = process.env.PORT;
} else {
  PORT = 7000;
}
var Cloudant = require('@cloudant/cloudant');
var url = "https://apikey-v2-1rbquh4lbloh8r6pmtyb802wotxs86k3vcdmqwwpwonj:fa11735420bc8686e7ddc948a8e1b291@0cc1d4cf-b2e7-44a5-8824-a6f3d998e1ac-bluemix.cloudantnosqldb.appdomain.cloud";
var username = "apikey-v2-1rbquh4lbloh8r6pmtyb802wotxs86k3vcdmqwwpwonj";
var password = "fa11735420bc8686e7ddc948a8e1b291";
var app = express();
const bodyParser = require('body-parser');
//const cors = require('cors');
//app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/////////////
// app.get('/', function (req, res) {
//   res.send("Welcome to cloudant database on IBM Cloud");
// });

app.use('/',express.static("public"))

//////////
app.get('/list_of_databases', function (req, res) {
  
Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
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
// app.post('/create-database', (req, res) => {
// var name=req.body.name;
// Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
//   if (err) {
//     return console.log('Failed to initialize Cloudant: ' + err.message);
//   }
// console.log(pong); // {"couchdb":"Welcome","version": ...

// cloudant.db.create(name, (err) => {
//   if (err) {
//     res.send(err);
//   } else {
// res.send("database created")
    
//   }
// });
// });
// });    




////////////// insert single document
app.post('/insert-document', function (req, res) {
  console.log("Request Body:", req.body);
  var id, name, email, phone, database_name, pickup, dropoff, date;
  database_name = req.body.db;
  id = req.body.id;
  name = req.body.name;
  email = req.body.email;
  phone = req.body.phone;
  pickup = req.body.pickup;
  dropoff = req.body.dropoff;
  date = req.body.date; // Assuming you have a 'date' field in your request body

  Cloudant({ url: url, username: username, password: password }, function (err, cloudant, pong) {
      if (err) {
          return console.log('Failed to initialize Cloudant: ' + err.message);
      }
      console.log(pong);

      cloudant.use(database_name).insert({ 
          "name": name, 
          "email": email, 
          "phone": phone, 
          "pickup": pickup, 
          "dropLocation": dropoff,
          "date": date 
      }, id, (err, data) => {
          if (err) {
              res.send(err);
          } else {
              res.send(data);
          }
      });
  });
});
 




/////   insert bulk documents
// app.post('/insert-bulk/:database_name', function (req, res) {
// var _id,name,address,phone,age;
// //var database_name;
// var database_name1=req.params.database_name;

// for (var i=0;i<3;i++) {

//   var student=
// {
// _id: req.body.docs[i].id,
//         name: req.body.docs[i].name,
//         address: req.body.docs[i].address,
//         phone: req.body.docs[i].phone,
//         age: req.body.docs[i].age,
// }
// //console.log(student);



// students.push(student);


// }

// console.log(students);
// Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
//   if (err) {
//     return console.log('Failed to initialize Cloudant: ' + err.message);
//   }
// console.log(pong); // {"couchdb":"Welcome","version": ..

// cloudant.use(database_name1).bulk({ docs:students }, function(err) {
//   if (err) {
//     throw err;
//   }

//   res.send('Inserted all documents');
// });
// });
// }); 




 




// //////////////// delete a document
// app.delete('/delete-document', function (req, res) {
// var id,rev,database_name;
// database_name=req.body.db;
// id=req.body.id;
// rev=req.body.rev;
// Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
//   if (err) {
//     return console.log('Failed to initialize Cloudant: ' + err.message);
//   }
// console.log(pong); // {"couchdb":"Welcome","version": ..

// cloudant.use(database_name).destroy(id, rev, function(err) {
//   if (err) {
//     throw err;
//   }

//   res.send('document deleted');
// });
// });
// });

// ////////////////






// //////////////// update existing document
// app.put('/update-document', function (req, res) {
// var id,rev,database_name;
// database_name=req.body.db;
// id=req.body.id;
// rev=req.body.rev;
// name = req.body.name;
// address =req.body.address;
// phone= req.body.phone;
// age= req.body.age;
// Cloudant({ url: url, username: username, password: password }, function(err, cloudant, pong) {
//   if (err) {
//     return console.log('Failed to initialize Cloudant: ' + err.message);
//   }
// console.log(pong); // {"couchdb":"Welcome","version": ..

// cloudant.use(database_name).insert({ _id:id , _rev: rev, "name": name , "age": age, "address": address, "phone": phone }, (err, data) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(data); // { ok: true, id: 'rabbit', ...
//       }
//     });
// });
// });

app.listen(PORT,()=>{
  console.log("server is running on port : " + PORT)
});