const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type:String,
        required : true
    },
    email : {
        type:String,
        required : true
    },
    password : {
        type:String,
        required : true
    },
    imgUrl : String, 
})

module.exports = mongoose.model("User",userSchema);