require('dotenv').config();

const express = require('express');
const port = process.env.port || 1001 ;

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