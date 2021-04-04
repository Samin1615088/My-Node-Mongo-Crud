const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const password = '15fW6UtKuWfHTSJX';
//mongodb connection
const uri = "mongodb+srv://organicUser:15fW6UtKuWfHTSJX@cluster0.u0gaq.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//send html file form  from server to client>>
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
})
//send html file form  from server to client<<



//mongodb crud>>
client.connect(err => {
  //connection established>>
  const productCollection = client.db("organicdb").collection("products");
  // perform actions on the collection object
  console.log('database connected');
  //connection established<<

  //create>> 
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log('req in server', product);
    //mongodb code>>
    productCollection.insertOne(product)  //insert from form index.html
      .then(result => {
        console.log('data added successfully');
        res.redirect('/');
      })
    //mongodb code<<
  });
  //create<<

  //read>>
  app.get("/products", (req, res) => {
    //mongodb code>>
    productCollection.find({}).limit(4)
      .toArray((err, documents) => { //toArray is related to mongodb, not part of vanila js
        res.send(documents);
      });
    //mongodb code<<
  })
  //read<<

  //update>>
  //get single data first>>
  app.get('/product/:id ', (req, res) => {
    console.log(req.params.id);
    //mongodb code>>
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
    //mongodb code<<
  })
  //then do update on get data
  app.patch("/update/:id", (req, res) => {
    //mongodb code>>
    productCollection.updateOne({ _id: ObjectId(req.params.id) }, {
      $set: { price: req.body.price, quantity: req.body.quantity, name: req.body.name }
    })
      .then(result => {
        console.log(result);
        res.send(result.modifiedCount > 0);
      })
    //mongodb code<<
  })
  //update<<


  //delete>>
  app.delete('/delete/:id', (req, res) => {
    console.log('req in server', req.params);

    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        console.log(result);
        res.send(result.deletedCount > 0);
      })

  })
  //delete<<
});
//mongodb crud<<


app.listen(3000);