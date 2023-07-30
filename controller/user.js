// ---------Import User Model-------------//
const User =require('../Models/user');

// ---------Import Bcrypt library-----------//
const bcrypt =require('bcrypt');


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
            
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password,salt);
            const newUser = new User({
                name:name,
                email:email,
                password:hashPassword
            });
            newUser.save();
            return res.status(200).json({
                message : 'User Registation Successfull...'
            });




        }catch(err){
            console.log(err);
            return res.status(400).json({
            message: 'unable to Register..'
            })
        }
   }
};

module.exports = userController;