const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const blogowner = require('../middleware/blogowner');
const jwt = require('jsonwebtoken');
const config = require('config');
const {Blog} = require('../models/blogs');
const {Author} = require('../models/authors');



router.post('/',[auth],async(req,res)=>{
    try{
        if(!mongoose.Types.ObjectId.isValid(req.body.authorId)) throw "Author Id could be wrong, Please provide valid author id "

        let author = await Author.findById(req.body.authorId);
        
        if(!author) 
        return res.status(400).send('author doesnt exist');
      else{
        let blog = new Blog(req.body);
        let newblog = await blog.save();
        res.status(201).json({status:'true',data: newblog})
      }
    }
    catch(err)
    {
        console.error("LOOK OUT!!", err);
        res.status(400).json({status:'false',message:err,message:err.message});   
    }
        console.log()
    
    });

router.get('/',[auth], async(req,res)=>{
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
