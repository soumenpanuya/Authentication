// ---------Import User Model-------------//
const User =require('../Models/user');

// ---------Import Bcrypt library-----------//
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const env =require('../config/enviroment');
const mailService = require('../config/nodemailer');
const crypto =require("crypto");
let passport= require("../config/passport");


class userController{
    // -------------User Registation Handle ------------//
    static userResistation = async(req,res)=>{
        try{
           const {name, email, password, confirm_password} = req.body;

           // ------------checking Required field------------//
           if(!name || !email || !password || !confirm_password){
            req.flash("success","All field required")
            return res.redirect("back");
            }
            
            // ------Checking Password Length--------//
            if(password.length <8){
                req.flash("success","Password must be at least 8 characters.")
                return res.redirect("back");
            }
            // -------- Checking Password Mismatch----------------//
            if(password !=confirm_password){
                req.flash("success","password not match..")
                return res.redirect("back");
            }


            const user =await User.findOne({email:email});
            if(user){
                req.flash("success","User already Exist Please Sign-in..")
                return res.redirect("back");
                
            }
            const token = jwt.sign({name, email,password},env.jwt_key,{expiresIn:'15m'});
            const data = {
                hostid: 'http://' + req.header.host,
                email : email,
                token : token
            }
            mailService.activeAccountMail(data);
            
            req.flash("success","Verification link send to your email..");
            return res.redirect("/user/login");
            
        }catch(err){
            console.log(err);
            req.flash("success","Unable to register..");
            return res.redirect("back");
        }
   }
   
    //------------- activate account Handeler ---------//
     static userAccountActvate = async(req,res)=>{
        try{
            const token =req.params.token;
            if(!token){
                req.flash("success","Invalid token..");
                return res.redirect("/user/login");
            }
            const decodetoken = await jwt.verify(token,env.jwt_key);

            const{name,email,password}= decodetoken;
            if(!name || !email || !password ){
                req.flash("success","Invalid token..")
                return res.redirect("/user/login");
                }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);

            const newuser = await User.create({
                name:name,
                email:email,
                password:hashPassword,
                avter :''
            })

            req.flash("success","Registation successfull please login..");
            return res.redirect("/user/login");
            
        }catch(err){
            console.log(err);
            req.flash("success","Unable to register..");
            return res.redirect("/user/login");
            
        }
     }



    // ----------user Login Handeler-----------//
   static userLogin =(req,res)=>{      
        return res.render("login");
   }

   static LoginSuccessfull =(req,res)=>{     
    req.flash("success","Login successfull..");
        return res.redirect("/")
   }

    //------------user logout handler-----------// 
   static userLogout =(req,res)=>{      
    req.flash("success","Logout successfull..")
        return res.redirect("/user/login");
   }
   
    // -----------Forget Password Handler--------------//
   static forgetPassword =async(req,res)=>{
        try{
            const {email} = req.body;
            if(!email){
                req.flash("success","Please enter email")
                return res.redirect("back");
            }
            const user =await User.findOne({email:email});
            if(!user){
                req.flash("success","Email not registered.")
                return res.redirect("back");
            }
            const resetCode = crypto.randomBytes(15).toString('hex');
            user.resetcode = resetCode;
            await user.save();
            const token =  jwt.sign({email,resetCode},env.jwt_key,{expiresIn:'15m'});
            const data = {
                hostid: 'http://' + req.header.host,
                email : email,
                token : token
            }
            mailService.forgetPasswordMail(data);

            req.flash("success","Reset link send to your email..")
            return res.redirect("/user/login");


        }catch(err){
            console.log(err);
            req.flash("success","Unable to proceed..")
                return res.redirect("back");
        }
   }

   static forgetPassword_step2 = async(req,res)=>{
        try{
            const token = req.params.token;
            if(!token){
                req.flash("success","Invalid token..");
                return res.redirect("/user/login");
            }
            const decodetoken = await jwt.verify(token,env.jwt_key);

            const{email,resetCode}= decodetoken;
            if(!email || !resetCode){
                req.flash("success","Invalid token..");
                return res.redirect("/user/login");
            }
            const user = await User.findOne({email:email});
            if(!user){
                req.flash("success","User not found..");
                return res.redirect("/user/login");
            }
            if(resetCode !== user.resetcode){
                req.flash("success","Password not match..");
                return res.redirect("/user/login");
            } 
            return res.render("resetpassword",{
                token: token
            });

        }catch(err){
            console.log(err);
            req.flash("success","password reset error..");
                return res.redirect("/user/login");
        }
   }

   static userResetPassword =async(req,res)=>{
        try{
            const email = req.user.email;
            const user = await User.findOne({email:email});
            const resetCode = crypto.randomBytes(15).toString('hex');
            user.resetcode = resetCode;
            await user.save();
            const token =  jwt.sign({email,resetCode},env.jwt_key,{expiresIn:'5m'});
            return res.render("resetpassword",{
                token:token
            })


        }catch(err){
            console.log(err);
        }
   }

   static new_reset_pasword = async(req,res)=>{
        try{
            const {password,confirm_password} =req.body;
            if(password.length <8){
                req.flash("success","Password must be at least 8 characters.")
                return res.redirect("back");
            }
            if(!password || !confirm_password){
                req.flash("success","all field required..");
                return res.redirect("back");
            }
            if(password !=confirm_password){
                req.flash("success","Password not match..");
                return res.redirect("back");
            }
            const token = req.params.token;
            if(!token){
                req.flash("success","Invalid token..");
                return res.redirect("back");
            }
            const decodetoken = await jwt.verify(token,env.jwt_key);

            const{email,resetCode}= decodetoken;
            if(!email || !resetCode){
                req.flash("success","Invalid token..");
                return res.redirect("back");
            }
            const user = await User.findOne({email:email});
            if(!user){
                req.flash("success","Invalid token..");
                return res.redirect("back");
            }
            if(resetCode != user.resetcode){
                req.flash("success","Invalid token..");
                return res.redirect("back");
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);
            user.password = hashPassword;
            await user.save();
            req.flash("success","Password reset successfull..")
             return res.redirect("/");


        }catch (err) {
            console.log(err);
            req.flash("success","Unable to process..")
            return res.redirect("back");
        }
   }

};

module.exports = userController;