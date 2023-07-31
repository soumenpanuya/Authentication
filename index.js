require('dotenv').config();
const env = require('./config/enviroment');

const express = require('express');
const port = env.port;

// --------Data Base configure----------//
require('./config/mongoose');

const app =express();

app.use(express.urlencoded({extended:true}));
//--------- send data json format-----------// 
app.use(express.json());

// ---------Routes--------//
app.use('/',require('./Routes/index'));

app.listen(port,(err)=>{
   if(err){
    return console.log(err);
   }
   console.log(`Server running port :${port}`);
})