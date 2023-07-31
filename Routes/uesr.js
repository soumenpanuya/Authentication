const express = require('express');
const passport = require('../config/passport');
const  router = express.Router();
const userController =require('../controller/user');

// ---------------Public Route---------//
router.post("/registation",userController.userResistation);

//-------------- Private Route-----------//
router.post("/login",passport.authenticate('local',{failureRedirect:'/user/login'}),userController.userLogin);


module.exports =router;