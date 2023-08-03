// ---------Import User Model-------------//
const User =require('../Models/user');

// ---------Import Bcrypt library-----------//
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const env =require('../config/enviroment');
const mailService = require('../config/nodemailer');
const crypto =require("crypto");


class userController{
    // -------------User Registation Handle ------------//
    static userResistation = async(req,res)=>{
        console.log("user registation");
        try{
           const {name, email, password, confirm_password} = req.body;

           // ------------checking Required field------------//
           if(!name || !email || !password || !confirm_password){
                return res.status(201).json({
                 message: 'all field required..'
                })
            }

            // -------- Checking Password Mismatch----------------//
            if(password !=confirm_password){
                 return res.status(201).json({
                 message: 'Password do not match...'
                })
            }

            // ------Checking Password Length--------//
            if(password.length <8){
                 return res.status(201).json({
                 message :'Password must be at least 8 characters..'
                })
            }

            const user =await User.findOne({email:email});
            if(user){
                return res.status(201).json({
                message : 'User already Exist...Please Sign-in..'
                })
            }
            const token = jwt.sign({name, email,password},env.jwt_key,{expiresIn:'15m'});
            const data = {
                hostid: 'http://' + req.header.host,
                email : email,
                token : token
            }
            mailService.activeAccountMail(data);
            
            return res.status(200).json({
                message : 'mail send Successfull...'
            });

        }catch(err){
            console.log(err);
            return res.status(400).json({
            message: 'unable to Register..'
            })
        }
   }
   
    //------------- activate account Handeler ---------//
     static userAccountActvate = async(req,res)=>{
        console.log("user registation step 2")
        try{
            const token =req.params.token;
            if(!token){
                return res.status(201).json({
                    message: 'account acctivation error..'
                })
            }
            const decodetoken = await jwt.verify(token,env.jwt_key);

            const{name,email,password}= decodetoken;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);

            const newuser = await User.create({
                name:name,
                email:email,
                password:hashPassword
            })
            return res.status(200).json({
                message : 'user registation successfull.. Please login',
                user :newuser
            })
        }catch(err){
            console.log(err);
            return res.status(201).json({
                message: 'Account activation error..'
            })
        }
     }



    // ----------user Login Handeler-----------//
   static userLogin =(req,res)=>{      
        return res.render("login");
   }

   static LoginSuccessfull =(req,res)=>{      
        return res.redirect("/")
   }

    //------------user logout handler-----------// 
   static userLogout =(req,res)=>{      
        return res.redirect("/user/login");
   }
   
    // -----------Forget Password Handler--------------//
   static forgetPassword =async(req,res)=>{
        try{
            const {email} = req.body;
            if(!email){
                return res.status(200).json({
                    message: " Please enter email"
                })
            }
            const user =await User.findOne({email:email});
            if(!user){
                return res.status(201).json({
                    message: "Email not registered."
                })
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

            return res.status(200).json({
                message: "Reset link sent to your account.."
            })


        }catch(err){
            console.log(err);
            return res.status(201).json({
                message: "Unable to proceed"
            })
        }
   }

   static forgetPassword_step2 = async(req,res)=>{
        try{
            const token = req.params.token;
            if(!token){
                return res.status(201).json({
                    message: 'Password reset error..'
                })
            }
            const decodetoken = await jwt.verify(token,env.jwt_key);

            const{email,resetCode}= decodetoken;
            if(!email || !resetCode){
                return res.status(201).json({
                    message: "user error"
                })
            }
            const user = await User.findOne({email:email});
            if(!user){
                return res.status(201).json({
                    message: "user error"
                })
            }
            if(resetCode !== user.resetcode){
                return res.status(201).json({
                    message: "password reset error"
                })
            } 
            return res.render("resetpassword",{
                token: token
            });

        }catch(err){
            console.log(err);
            return res.status(201).json({
                message : " Unable to Proceed.."
            })
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
            if(!password || !confirm_password){
                return res.status(200).json({
                    message: "all field required"
                })
            }
            if(password !=confirm_password){
                return res.status(200).json({
                    message: "password not match"
                })
            }
            const token = req.params.token;
            if(!token){
                return res.status(201).json({
                    message: 'invalid token..'
                })
            }
            const decodetoken = await jwt.verify(token,env.jwt_key);

            const{email,resetCode}= decodetoken;
            if(!email || !resetCode){
                return res.status(201).json({
                    message: "invalid token"
                })
            }
            const user = await User.findOne({email:email});
            if(!user){
                return res.status(201).json({
                    message: "user not found"
                })
            }
            if(resetCode != user.resetcode){
                return res.status(201).json({
                    message: "invalid token.."
                })
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);
            user.password = hashPassword;
            await user.save();
            return res.redirect("/user/login");


        }catch (err) {
            console.log(err);
        }
    return res.render("resetpassword");
   }

};

module.exports = userController;