const express = require('express');
const passport = require('../config/passport');
const  router = express.Router();
const userController =require('../controller/user');

// ---------------Public Route---------//
router.get("/login/",userController.userLogin);
router.post("/registation",userController.userResistation);

router.get("/registation-step2/:token",userController.userAccountActvate);
router.post("/forgetPassword",userController.forgetPassword);
router.get("/forgetPassword-step2/:token",userController.forgetPassword_step2);
router.post("/new-password-set/:token",userController.new_reset_pasword);



//-------------- Private Route-----------//
router.post("/login-session",passport.authenticate('local',{failureRedirect:'/user/login'}),userController.LoginSuccessfull);
router.get("/logout",passport.logout,userController.userLogout);
router.get("/user-resetpassword",passport.checkauthenticate,userController.userResetPassword);

module.exports =router;