const jwt = require('jsonwebtoken');
const config = require('config');

async function auth(req, res, next) {
    const token = req.header('x-api-key');;
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
      const decoded = jwt.verify(token, 'jwtPrivateKey');
      req.author = decoded;
      next();
    }
    catch (ex) {
      res.status(400).send('Invalid token.');
    }
  }

  module.exports= auth;