// ---------Import User Model-------------//
const User =require('../Models/user');

// ---------Import Bcrypt library-----------//
const bcrypt =require('bcrypt');
const jwt = require('jsonwebtoken');
const env =require('../config/enviroment');
const accountmail = require('../config/nodemailer');


class userController{
    // -------------User Registation Handle ------------//
    static userResistation = async(req,res)=>{
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
            accountmail.newmail(data);
            
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
            // const newUser = new User({
            //     name:name,
            //     email:email,
            //     password:hashPassword
            // });
            // newUser.save();

            const newuser = await User.create({
                name:name,
                email:email,
                password:hashPassword
            })
            return res.status(200).json({
                message : 'user registation successfull..',
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
        
            return res.status(200).json({
                user : req.user,
                message: 'You are successfully login...'
            })
   }
};

module.exports = userController;