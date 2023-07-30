const mongoose = require('mongoose');

(async function(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/Authentication");
        console.log("Data Base connected...")

    }catch(err){
        console.log("Connect mongoDB ERROR:",err);
    }

})();