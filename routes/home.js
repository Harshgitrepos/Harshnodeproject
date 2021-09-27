const express = require('express');
const router = express.Router();
const {Author} = require('../models/authors');
  
  router.post('/', async (req, res) => {

    console.log("here");
    // these statements should be in try catch.
    let nuauth = await Author.findOne({ email: req.body.email });
    // there is no password here.
    if (!nuauth) return res.status(400).send('Invalid email or password.');
    
    // you are assigning req.body.password in if block ...if block is meant to check truth.
    // there is no email here. and your password is going to be encrypted in the db hence you can never compare 
    // req.body.password and mauth.password .
    
    if(nuauth.password=!req.body.password) return res.status(400).send('Invalid email or password.');
    
    const token = nuauth.generateAuthToken();
    
    res.send({
        'x-api-key' : token,
        name : nuauth.fname
    });
  });

  module.exports = router;