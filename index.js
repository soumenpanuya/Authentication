require('dotenv').config();

const express = require('express');
const port = process.env.port || 1001

const app =express();

app.get('/',(req,res)=>{
    res.send('Wellcome to my Universe...')
});

app.listen(port,(err)=>{
   if(err){
    return console.log(err);
   }
   console.log(`Server running port :${port}`);
})