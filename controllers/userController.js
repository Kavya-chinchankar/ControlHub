const User = require('../models/userModel');

// to bcrpt the password
const bcrypt = require('bcrypt');

// for mail
const nodemailer = require("nodemailer");

// to get random string
const randomstring = require("randomstring");

// to give email and pass 
const config = require("../config/config");


// to secure the password

const seccurePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    }catch (error){
        console.log(error.message);
    }
}

// For Registration

const loadRegister = async(req,res)=>{
    try{
        res.render('ragistration');

    }catch (error){
        console.log(error.message);
    }
}

// For Registration
// to store value instering user

const insertUser = async(req,res)=>{
    try{
        const spassword = await seccurePassword(req.body.password);
        const user = new User ({
                name:req.body.name,
                email:req.body.email,
                mno:req.body.mno,
                password:spassword,
                is_admin:0
        });

        const userData = await user.save();

        if(userData){
            sendverifyMail( req.body.name,req.body.email,userData._id);
            res.render('ragistration',{message:"Your registration has been successfull, Please varify your Email"});
        }                                                                     
        else{
            res.render('ragistration',{message:"Your registration has been failed"})
        }

    }catch (error){
        console.log(error.message);
    }
}

// TO SEND MAIL

const sendverifyMail = async(name, email, user_id)=>{
    try{
      const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:config.emailUser,
            pass:config.emailPassword
        }
       });

       const mailOption = {
        from:'emailUser',
        to:email,
        subject:'For verification mail',
        html:'<p>Hii '+name+' , Please click here to <a href="http://localhost:3000/varify?id='+user_id+'">Varify</a> Your mail.</p>'
       }

       transporter.sendMail(mailOption, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email has been sent:- ",info.response);
        }
       })

    }catch (error){
        console.log(error.message);
    }
}

// // varify Mail

const varifyMail = async(req,res)=>{
    try{
        const updateInfo = await User.updateOne({ _id:req.query.id }, { $set: { is_varified:1 } });
        console.log(updateInfo);
        res.render('emailVarifed');

    }catch (error){
        console.log(error.message);
    }
}


// login user method start

const loginLoad = async(req,res)=>{
    try{
        res.render('login');

    }catch (error){
        console.log(error.message);
    }
}

// login user method start
// to verify login

const varifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){
                const passwordMatch = await bcrypt.compare(password,userData.password);
                if (passwordMatch) {
                    if (userData.is_varified === 0) {
                              res.render('login',{message:"Varify Your Email"});                      
                    } else {
                        console.log(userData._id);
                        req.session.user_id = userData._id;
                    res.redirect('home');                        
                    }
                    
                } else {
                res.render('login',{message:"Email and Password is incorrect"});
                    
                }              
            }
            else{
                res.render('login',{message:"Email and Password is incorrect"});
            }


    }catch (error){
        console.log(error.message);
    }
}

//after login the home page loading

const loadHome = async(req,res)=>{
    try{
        const userData = await User.findById({ _id:req.session.user_id});
        res.render('home',{user:userData});

    }catch (error){
        console.log(error.message);
    }
}

// to log out from home

const userLogout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');

    }catch (error){
        console.log(error.message);
    }
}

// forget password page loading

const forgetLoad = async(req,res)=>{
    try{
        res.render('forget');
        

    }catch (error){
        console.log(error.message);
    }
}


//TO REST PASSWORD SEND MAIL

const sendResertPasswordMail = async(name, email, token)=>{
    try{
      const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
            user:config.emailUser,
            pass:config.emailPassword
        }
       });

       const mailOption = {
        from: config.emailUser,
        to:email,
        subject:'For Reset password ',
        html:'<p>Hii '+name+' , Please click here to <a href="http://localhost:3000/forget-password?token='+token+'"> Reset </a>your Password.</p>'
       }

       transporter.sendMail(mailOption, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email has been sent:- ",info.response);
        }
       })

    }catch (error){
        console.log(error.message);
    }
}

// to varify the forget email

const forgetvarify = async(req,res)=>{
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});
        if (userData) {
            if (userData.is_varified === 0) {
                res.render('forget',{message:"Varify ur email"});                      
                } 
            else{
                const randomString = randomstring.generate();
                const updateData = await User.updateOne({ email:email }, { $set: { token:randomString } });
                sendResertPasswordMail(userData.name,userData.email,randomString)
                res.render('forget',{message:"Please chech your mail to reset your password"});                      

            }
            
        } else {
            res.render('forget',{message:"Your Email is incorrect"});
        }

    }catch (error){
        console.log(error.message);
    }
}


//TO Reset password for forget password page loading

const forgetPasswordLoad = async(req,res)=>{
    try{
        const token = req.query.token;

        const tokenData = await User.findOne({token:token});

        if (tokenData ) {
            res.render('forget-password',{user_id:tokenData._id});
        } else {
            res.render('404',{message:"Uh Oh! Page not found!"});
        
            
        }

    }catch (error){
        console.log(error.message);
    }
}

// to reest password

const resetPassword = async(req,res)=>{
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;

        const seccure_password =await seccurePassword(password);

        const updateData = await User.findByIdAndUpdate({ _id:user_id }, { $set: { password:seccure_password, token:'' } });

        res.redirect('/');

        

    }catch (error){
        console.log(error.message);
    }
}

// varifiction email page loder

const varificationLoad = async(req,res)=>{
    try{
        res.render('varification');
        

    }catch (error){
        console.log(error.message);
    }
}

// To send varifiction post link

const SendVarificationLink = async(req,res)=>{
    try{
        const email = req.body.email;
        const userData = await User.findOne({email:email});

        if (userData) {
                sendverifyMail(userData.name, userData.email, userData._id);
                res.render('varification',{message:"varify ur email"});                             
        } else {
            res.render('varification',{message:"Your Email is incorrect"});
        }
         

    }catch (error){
        console.log(error.message);
    }
}

//user profile edit and update

const editLoad =async(req,res)=>{
    try{
         const id = req.query.id;

        const userData = await User.findById({ _id:id });
        if(userData){
            res.render('edit', { user:userData});
        
        }
        else{
            res.redirect('home');
        }

    }catch(error){
        console.log(error.message);
    }

}

// update profile

const updateProfile =async(req,res)=>{
    try{
        // const id = req.body.user_id;

        if(req.file){
            const userData = await User.findByIdAndUpdate({ _id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, image:req.file.filename }});
            res.redirect('/home');
        }
        else{
            
            const userData = await User.findByIdAndUpdate({ _id:(req.body.user_id)},{$set:{name:req.body.name, email:req.body.email }});
            res.redirect('/home');
            
        }

        res.redirect('/home');

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    sendverifyMail,
    varifyMail,
    loginLoad,
    varifyLogin,
    userLogout,
    loadHome,
    forgetLoad,
    forgetvarify,
    sendResertPasswordMail,
    forgetPasswordLoad,
    resetPassword,
    varificationLoad,
    SendVarificationLink,
    editLoad,
    updateProfile
}
