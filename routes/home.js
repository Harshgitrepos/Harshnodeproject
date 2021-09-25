const express = require('express');
const router = express.Router();
const {Author} = require('../models/authors');

  router.post('/', async (req, res) => {

    console.log("here");
    let nuauth = await Author.findOne({ email: req.body.email });
    if (!nuauth) return res.status(400).send('Invalid email or password.');

    if(nuauth.password=!req.body.password) return res.status(400).send('Invalid email or password.');

    const token = nuauth.generateAuthToken();
    res.send({
        'x-api-key' : token,
        name : nuauth.fname
    });
  });

  module.exports = router;