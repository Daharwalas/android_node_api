const mongoose = require('mongoose');

const propertySchema = mongoose.Schema({
    userId : String,
    title : String,
    location : String,
    city : String,
    locality : String,
    price : Number,  
    imageUrl :String,
    booked : Boolean
});

module.exports = mongoose.model("Property",propertySchema);
