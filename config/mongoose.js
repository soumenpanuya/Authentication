const mongoose = require('mongoose');
const env =require('./enviroment');

(async function(){
    try{
        await mongoose.connect(env.db);
        console.log("Data Base connected...")

    }catch(err){
        console.log("Connect mongoDB ERROR:",err);
    }

})();