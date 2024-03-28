const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bcrpyt = require('bcrypt');

const Property = require('../android_node_api/modules/property');
const User = require('../android_node_api/modules/user');

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CONNECTION = process.env.CONNECTION;
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', true);


const usertest = new User({
    name:"demo",
    email:"demo@gmail.com",
    password:"1234"
})


app.get("/test/",(req,res) => {
    res.status(200);
    res.send(usertest);
});

// testing
app.get("/user/test",async (req,res)=>{
    try{
        const user = await User.create(usertest);
        res.send(user);
        await user.save();
        res.status(201);
    }catch(e){
        res.sendStatus(404);
        console.log(e.message);
    }

});


// for regsiter user
app.post('/api/register/',async(req, res) => {
    console.log(req.body);

    try {

        const user_exist = await User.findOne({email: req.body.email})
        console.log(user_exist);
        if(user_exist){
            res.status(404).json({'success':false,'msg': "User not found"});
        }else{
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password : await bcrpyt.hash(req.body.password,12),
                // proOnRent : req.body.proOnRent,
                // proToRent : req.body.proToRent
                // not required to register
            });
            await user.save();
            res.json({'success':true,"token":user._id,"msg":"Registered"});
            res.status(200);
        }
   
    } catch (e) {
        res.status(400).json({'success':false, "msg": e.message });
    }


});
// for Login user
app.get('/api/login/',async (req, res) => {
    console.log(req.body);

    try {
        const user = await User.findOne({email:req.body.email}); //

        if(!user){
           res.status(404).json({'success':false,'msg': "User not found"});
        }else{
            console.log(user);
            if(bcrpyt.compareSync(req.body.password, user.password)){ // checking password
                res.json({'success':true,"token":user._id});
                res.status(200);
            } 
        }
       
      
    } catch (e) {
        res.status(400).json({ 'success':false,"msg": e.message});
    }


});

// for creating property to rent //rent page
app.post('/api/property/torent/',async(req, res) => {
    console.log(req.body);
    
    try {   
            const property = await Property.create({
                title: req.body.title,
                userId: req.body.userId,
                location : req.body.location,
                city : req.body.city,
                locality : req.body.locality,
                price : req.body.price,  
                imageUrl :req.body.imageUrl,
                booked : req.body.booked
            });
            await property.save();
            console.log(property);
            res.json({'success':true,"token":property._id,"msg":"verified to rent"});
        
   
    } catch (e) {
        res.status(400).json({'success':false, "msg": e.message });
    }


});

// for fetching all property on rent (top 5) // explore
app.get('/api/property/onrent/',async(req, res) => {
    try {   
            const properties = await Property.find({}).limit(5);
            console.log(properties);
            res.json({'success':true,"list":properties,"msg":"verified to rent"});
        
    } catch (e) {
        res.status(400).json({'success':false, "msg": e.message });
    }


});

// for fetching for specific property on rent (top 5)
app.get('/api/property/onrent/:rentId',async(req, res) => {
    const rentId = req.params.rentId; // on clicking card all details of that will be shown on next page

    try {   
            const properties = await Property.findOne({_id:rentId});
            if(properties == null){
                res.status(400).json({'success':false, error: e.message });
            }
            console.log(properties);
            res.json({'success':true,"list":properties,"msg":"return properties"});
        
    } catch (e) {
        res.status(400).json({'success':false, "msg": e.message });
    }

});

// for fetching for properties on rent of customer
app.get('/api/property/onrent/user/:userid',async(req, res) => {
    const userId = req.params.userid; // all properties rented by user will be shown on rent page where user can add new rent properies
    try {   
            const properties = await Property.find({userId : userId});
            if(properties.length <1){
                res.status(400).json({'success':false, "msg":"no prppery exist for user"});
            }else{
                console.log(properties);
                res.json({'success':true,"list":properties,"msg":"returned properties of customer"});
            }
       
        
    } catch (e) {
        res.status(400).json({'success':false, "msg": e.message });
    }

});
// connecting to mongodb and starting the server
const start = async () => {
    try {
        await mongoose.connect(CONNECTION);
        app.listen(PORT, () => {
            console.log("app listing for port " + PORT);
        });
    } catch (error) {
        console.log(error.message);
    }

};

start();
