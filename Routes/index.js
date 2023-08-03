const express = require('express');
const passport =require("../config/passport");
const router = express.Router();

router.use('/user',require('./uesr'));  

// ----------private route----------//
router.get("/",passport.checkauthenticate,(req,res)=>{
    return res.render("home")
});



module.exports =router;