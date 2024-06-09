const mongoose = require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

require('dotenv').config()

mongoose.connect(process.env.MONGO_URL);


const express = require("express");
const app = express();

//for user route

const userRoute = require('./routes/userRoute');
app.use('/',userRoute);

// for admin route

const adminRoute = require('./routes/adminsRoute');
app.use('/admin',adminRoute);

app.listen(3000,function(){
    console.log("Server is running")
})

