require('dotenv').config();
const env = require('./config/enviroment');

const express = require('express');
const port = env.port;
const app =express();

// --------Data Base configure----------//
require('./config/mongoose');
const connectmongo =require("connect-mongo");

const session =require('express-session');

// -----------passport Authentication--------//
const passport =require('passport');
require('./config/passport');


app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("./assets"));

app.use(express.urlencoded({extended:true}));
//--------- send data json format-----------// 
app.use(express.json());
app.use(session({
   name : "secret",
   secret: env.session_secret,
   resave:false,
   saveUninitialized:false,
   cookie: {
      maxAge:(1000 * 60 *60)
   },
   store: connectmongo.create({
      mongoUrl: env.db,
      autoRemove:"disabled"
   },(err)=>{
      console.log(err);
   })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setauthenticateduser);

// ---------Routes--------//
app.use('/',require('./Routes/index'));

app.listen(port,(err)=>{
   if(err){
    return console.log(err);
   }
   console.log(`Server running port :${port}`);
})