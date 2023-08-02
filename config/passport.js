const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../Models/user');
const bcrypt =require('bcrypt');


passport.use(new LocalStrategy({usernameField : 'email'},async(email,password,done)=>{
    try{
        // ---------checl all field----------//
        if(!email || !password){
            return done(null, false, {message: 'all field required..'});
        }
        // ---------user find---------//
        const user = await User.findOne({email:email});
        if(!user){
            return done(null, false ,{message :'user not register...'});
        }
        // ----------check password match------------//
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            return done(null , false ,{messages: 'username / password not match...'});
        }
        return done(null, user);


    }catch(err){
        console.log(err);
    }
}));

passport.serializeUser((user,done)=>{
   return done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    try{
        const user =await User.findById(id);
        if(!user){
          return  done(null, false);
        }
        return done(null, user);
    }catch(err){
        console.log(err);
    }
});

passport.checkauthenticate =(req,res,next)=>{

    if(req.isAuthenticated())
    {
        return next();
        
    }
    return res.redirect("/user/login");
}

passport.setauthenticateduser =(req,res,next)=>{
    if(req.isAuthenticated())
    {
        res.locals.user =req.user;
    }
    next();
}

passport.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){return next(err)};
         next();
    })
}

module.exports =passport ;