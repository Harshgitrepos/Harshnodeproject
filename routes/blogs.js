const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const blogowner = require('../middleware/blogowner');
// jwt and config are not used.
const jwt = require('jsonwebtoken');
const config = require('config');

const {Blog} = require('../models/blogs');
const {Author} = require('../models/authors');



router.post('/',[auth],async(req,res)=>{
    // what is the point of checking users by id ... all these information should be accessible 
    // with middleware.
    try{
        if(!mongoose.Types.ObjectId.isValid(req.body.authorId)) throw "Author Id could be wrong, Please provide valid author id "

        let author = await Author.findById(req.body.authorId);
        
        if(!author) 
        return res.status(400).send('author doesnt exist');

        // if you are using return statement what is the point having else here.
        // you should never use req.body in the app directly
      else{
        let blog = new Blog(req.body);
        let newblog = await blog.save();
        res.status(201).json({status:'true',data: newblog})
      }
    }
    /* 
        always follow standard format in your codebase
        try{
            
        }catch(e){

        }

        wrong way
        try {

        }
        catch(e){


        }
    
    
    */
    catch(err)
    {
        console.error("LOOK OUT!!", err);
        res.status(400).json({status:'false',message:err,message:err.message});   
    }
        // what is this 
        console.log()
    });

router.get('/',[auth], async(req,res)=>{

    /* 
        I have no idea what is the purpose of JSON.strinify here and why are you checking this here.
        phir length kyu kar rhe ho

        JSON.stringify({abc:1})
        '{"abc":1}'
        how is your data base going to fetch it using a stringified object
    */
    
        let a = JSON.stringify(req.query);
        console.log(a.length);
    try{
        if(a.length>4)
        {
        let reqblog = await Blog.find(req.query);
        
        if(reqblog.length==0)
        return res.status(404).json({status:'false', message:'no blogs matching the criteria available'});
  
        res.status(200).json({status:'true',data: reqblog});
        }
    else{
        console.log("in the else block");
        let reqblog = await Blog.find({isPublished:true,isDeleted:false});
        res.status(200).json(reqblog);
        }
        }
        catch(err)
        {
        res.status(404).json({status:'false',message:err.message});
        console.log(err)  
        }
        })

router.put('/:id', [auth,blogowner], async(req,res)=>{    
    let a =   req.body.body;  
    console.log(a);  
try{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) throw "Id is invalid";
    
    
    let upblog = await Blog.findById(req.params.id);
    if(!upblog || upblog.isDeleted) return res.status(404).json({status:"false",message : "Blog id does not exist"});

    else{
    /*
        who checks the truthy of a varible in if statement ?? abc===true . Please study about by value and the reference using js. 
    */ 
    
    if(req.body.publishedAt === true)
    {
        console.log("published true")
        let blogup2 = await Blog.findByIdAndUpdate(req.params.id,
            {
                $currentDate: {
                   publishedAt:true
                },
                $set: {
                   isPublished:req.body.isPublished
                }
              },{new:true});
        res.status(200).json({status:'true',data:blogup2});
    }
    
    else
    {
        let blogup1 = await Blog.findByIdAndUpdate(req.params.id,
        {
        title: req.body.title,
        body : req.body.body,
        tags : req.body.tags,
        subcategory : req.body.subcategory
        },{new: true});
        res.status(200).json({status:'true',data:blogup1});  
    }
    }
    }
    catch(err)
    {
    res.status(404).json(`${err.message} + ${err}`);  
    }

});

router.delete('/:id',[auth,blogowner], async (req, res) => {
        try{
        const blog = await Blog.findById(req.params.id);
        if (!blog || blog.isDeleted) return res.status(404).json({status : false, message : 'The blog with the given ID was not found'});
        else{

        var delblog = await Blog.findByIdAndUpdate(req.params.id,
        {
          $currentDate: {
             deletedAt:true
          },
          $set: {
             isDeleted:true
          }
        }
        );

         res.status(200).send();
        }
        }
        catch(err){
        console.log(err);
        res.json({status:'false',message: "Invalid Id"});

        }});



router.delete('/',[auth,blogowner], async (req, res) => {

try{
    const blog = await Blog.find(req.query);
    console.log(blog);
    let a=0;
    for (b of blog)
    {   console.log(b.isDeleted)
        if(b.isDeleted){
        
        console.log(a);
        }
        else{
            a++;
        }
    }
    console.log(a);
    console.log(blog.isPublished);
    if (!blog || a==0) return res.status(404).send(YAML.stringify({status : false, message : 'No blogs with the given query found'}));
    else{
        const blogdeletion = await Blog.find(req.query);
        for (b of blogdeletion)
    {   console.log(`iamhere${b.isDeleted}`)
        if(b.isDeleted==false){
            console.log("here2")
            let delblogq = await Blog.findByIdAndUpdate(b._id,
                {
                  $currentDate: {
                     deletedAt:true
                  },
                  $set: {
                     isDeleted:true
                  }
                });
           
        }
        
    }
     res.status(200).send();
    }
    }
    catch(err){
        console.log(err);
        res.json({status:'false',message:'Invalid Id'});

    }
});

module.exports=router;
