const mongoose =require('mongoose');

const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    email :{
        type: String,
        required :true
    },
    password :{
        type : String,
        required: true
    },
    resetcode :{
        type : String,
        default: ''
    }

},{
    timestamps: true
});

const userschema = mongoose.model("User",userSchema);
module.exports = userschema;