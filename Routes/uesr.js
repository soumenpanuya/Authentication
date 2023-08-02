const express = require('express');
const passport = require('../config/passport');
const  router = express.Router();
const userController =require('../controller/user');

// ---------------Public Route---------//
router.get("/login/",userController.userLogin);
router.post("/registation",userController.userResistation);

router.get("/accountActivate/:token",userController.userAccountActvate);



//-------------- Private Route-----------//
router.post("/login_data",passport.authenticate('local',{failureRedirect:'/user/login'}),userController.LoginSuccessfull);
router.get("/logout",passport.logout,userController.userLogout);

module.exports =router;