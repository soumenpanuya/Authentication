const passport =require('passport');
const LocalStrategy = require('passport-local').Strategy;
const googleStrategy =require("passport-google-oauth").OAuth2Strategy;
const User = require('../Models/user');
const bcrypt =require('bcrypt');
const crypto = require("crypto");
const env = require("./enviroment");


passport.use(new LocalStrategy({usernameField : 'email',passReqToCallback:true},async(req,email,password,done)=>{
    // passReqToCallback:true this argument pass req object to callback function....
    try{
        // ---------checl all field----------//
        if(!email || !password){
            return done(null, false, req.flash("error",'all field required..'));
        }
        // ---------user find---------//
        const user = await User.findOne({email:email});
        if(!user){
            return done(null, false ,req.flash("error",'username / password not match...'));
        }
        // ----------check password match------------//
        const ismatch = await bcrypt.compare(password,user.password);
        if(!ismatch){
            return done(null , false ,req.flash("error",'username / password not match...'));
        }
        return done(null, user);


    }catch(err){
        console.log(err);
    }
}));

passport.use(new googleStrategy({
        clientID:env.google_clientID,
        clientSecret:env.google_clientSecret,
        callbackURL:env.google_callbackURL
    },
    async(accessToken, refreshToken, profile,done)=>{
        try{
            let user = await User.findOne({email:profile.emails[0].value});
            console.log(profile);
            if(user){
                return done(null,user)
            }else{
               let newuser= await User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(15).toString('hex'),
                    avter :profile._json.picture
                })
                return done(null,newuser)
            }

        }catch(err){
            console.log(err);
            return done(err,false);
        }

    }
))

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