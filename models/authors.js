const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    fname : {
        type : String,
        required: true
    },
    lname : {
        type : String,
        required : true
      },
    title:{
        type : String,
        enum : ['Mr','Mrs','Miss']
    },
    email:{
        type : String,
        unique : true,
        required : true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
      password:
      {
          type : String,
          required : true
      },

})
authorSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id,fname :this.fname
    }, 'jwtPrivateKey');
    return token;
  }

const Author = mongoose.model('Author', authorSchema);

exports.Author = Author;