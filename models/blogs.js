const mongoose = require('mongoose');

const Blog = mongoose.model('Blog', new mongoose.Schema({

    title : {
        type : String,
        required: true
  
    },
    body : {
        type : String,
        required : true
    },
    authorId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
  
    },
    tags : {
        type : [String]
    },
    category : {
        type : String,
        required: true,
        alias : 'cat',
        validate : {
            validator: function(v){
            return v.length > 0;
        },
        message : 'Category cannot be empty'
    }
  
    },
     subcategory : {
            type:[String],
            alias : 'scat'
        },
    deletedAt : {
        type : Date,   
    },
    isDeleted : {
        type : Boolean,
        default : false
  
    },
    publishedAt : {
        type : Date,
    },
    isPublished:{
        type : Boolean,
        default : false
    }
  },{
    timestamps : true
}));

exports.Blog = Blog;
