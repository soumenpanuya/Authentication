const express = require('express');

const router = express.Router();

router.use('/user',require('./uesr'));
router.get("/",(req,res)=>{
    return res.render("login",{
        title : 'AUTH'
    })
})



module.exports =router;