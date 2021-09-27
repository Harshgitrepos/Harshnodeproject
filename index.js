const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());

// 1. imports config and jwt is not needed here as it is not used.
const config = require('config');
const jwt = require('jsonwebtoken');

// 2. Keep all imports together to have a better readability. 
const authors = require('./routes/authors');
app.use('/authors',authors);
const blogs = require('./routes/blogs');
app.use('/blogs',blogs);
const home = require('./routes/home');
app.use('/',home);
const auth = require('./middleware/auth');


// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://harsh:<mongodb@123>@cluster0.yyb46.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
// const collection = client.db("test").collection("devices");
// perform actions on the collection object
// client.close();
// });


// Use process.exit() to close the server in case of mongodb err and the server.
mongoose.connect('mongodb://localhost/HarshNodeProjectTestEnv1')
.then(()=>console.log('Connected to MongoDB Test Environment..'))
.catch(err=>console.error('Could not connect to mongo',err))


const port= process.env.PORT || 5002;
app.listen(port, ()=> console.log(`Listening on ${port}`));

