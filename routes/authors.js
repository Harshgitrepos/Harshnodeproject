const express = require('express');
const router = express.Router();
const {Author} = require('../models/authors');

router.post('/',async(req,res)=>{

    let user = await Author.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered')
    else
    {
    try{

        let author = new Author(req.body);
        let newuser = await author.save();
        res.send({
            name: newuser.fname,
            email:newuser.email,
            _id:newuser._id
        })
        return;
    }
    catch(err)
    {
        console.error("LOOK OUT!!", err);
        res.status(400).json({status:'false',message:err.message})
        return;
    }


        console.log()

    }});

    module.exports=router;