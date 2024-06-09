const User = require('../models/userModel');

const bcrypt = require('bcrypt');

// for mail
const nodemailer = require("nodemailer");

// to get random string
const randomstring = require("randomstring");

// to give email and pass 
const config = require("../config/config");

//to export exceljs

const exceljs = require('exceljs');

// html to pdf genatres require things

const ejs = require('ejs');
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');
const { response } = require('../routes/adminsRoute');


// to secure the password

const seccurePassword = async(password)=>{
    try{
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    }catch (error){
        console.log(error.message);
    }
}

// Admin login user method start

const loginLoad = async(req,res)=>{
    try{
        res.render('adminLogin');

    }catch (error){
        console.log(error.message);
    }
}


// login user method start
// to verify loginwd

const varifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin === 0){
                    res.render('adminLogin',{message:"YOU ARE NOT ADMIN"});
                }
                else{
                    req.session.user_id = userData._id;
                    
                    res.render("newhome", { user: userData });
                }
     
            }
            else{
                res.render('adminLogin',{message:"Username and password is incorrect"});
            }

        }
        else{
            res.render('adminLogin',{message:"Username and password is incorrect"});
        }

    }catch (error){
        console.log(error.message);
    }
}

// LOAD ADMIN LOGIN PAGE
const loadnewhome = async(req,res)=>{
    try{
        const userData = await User.findById({ _id:req.session.user_id});
        res.render('newhome',{user:userData});

    }catch (error){
        console.log(error.message);
    }
}

// to log out from home


const logout = async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');
    }catch (error){
        console.log(error.message);
    }
}

// forget password page loading
const forgetLoad = async(req,res)=>{
    try{
        res.render('adminForget');
        
    }catch (error){
        console.log(error.message);
    }
}

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
        html:'<p>HII '+name+' , please click here to <a href="http://localhost:3000/admin/forget-password?token='+token+'">Reset</a> your password.</p>'
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
            if (userData.is_admin === 0) {
                res.render('adminForget',{message:"You Are Not Admin"});                      
                } 
            else{
                const randomString = randomstring.generate();
                const updateData = await User.updateOne({ email:email }, { $set: { token:randomString } });
                sendResertPasswordMail(userData.name,userData.email,randomString)
                res.render('adminForget',{message:"Please chech your mail to reset your password"});                      

            }
            
        } else {
            res.render('adminForget',{message:"Your Email is incorrect"});
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
            res.render('404',{message:"Page NOT FOUND"});
        
            
        }

    }catch (error){
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
    try{
        const password = req.body.password;
        const user_id = req.body.user_id;

        const seccure_password =await seccurePassword(password);

        const updateData = await User.findByIdAndUpdate({ _id:user_id }, { $set: { password:seccure_password, token:'' } });

        res.redirect('/admin');        

    }catch (error){
        console.log(error.message);
    }
}

// DASHBORD LODING
const adminDashboard = async(req,res)=>{
    try{
         var search = '';
         if(req.query.search){
            search = req.query.search;
         }

         var page = 1;
         if (req.query.page) {
            page = req.query.page;
         }

         const limit = 3;

        const userData = await User.find({
            is_admin:0,
            $or:[
                { name : { $regex: '.*'+search+'.*', $options:'i'}},
                { email : { $regex: '.*'+search+'.*',$options:'i'}},
                { mno : { $regex: '.*'+search+'.*',$options:'i'}},
            ]
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        
        const count = await User.find({
            is_admin:0,
            $or:[
                { name : { $regex: '.*'+search+'.*', $options:'i'}},
                { email : { $regex: '.*'+search+'.*',$options:'i'}},
                { mno : { $regex: '.*'+search+'.*',$options:'i'}},
            ]
        }).countDocuments();

        res.render('dashboard',{
            users:userData,
            totalPages : Math.ceil(count/limit),
            countPage : page,

        });

    }catch (error){
        console.log(error.message);
    }
}

// ADD NEW USER THRIUGFH ADMIN

const newUserLoad = async(req,res)=>{
    try{
        res.render('new-user');

    }catch (error){
        console.log(error.message);
    }
}

// TO SEND MAIL

const addUserMail = async(name, email,password, user_id)=>{
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
        from:config.emailUser,
        to:email,
        subject:'Admin Added You And please varify Your mail',
        html:'<p>HII '+name+' , please click here to <a href="http://localhost:3000/varify?id='+user_id+'">Varify</a>Your mail. <br> <b> Email:-</b> '+email+'<b> Password:-</b> '+password+'  </p>  '  
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

// to store the value from the new user
const addUser = async(req,res)=>{
    try{

        const name=req.body.name;
        const email = req.body.email;
        const mno = req.body.mno;
        const password = randomstring.generate(8);

        const spassword = await seccurePassword(password);

        const user = new User ({
            name:name,
            email:email,
            mno:mno,
            password:spassword,
            is_admin:0

        });

        const userData = await user.save();

        if(userData){
            addUserMail(name, email, password, userData._id)
            res.redirect('/admin/dashboard');
        }
        else{
            res.render('new-user',{message:"Your registration has been failed"})
        }

    }catch (error){
        console.log(error.message);
    }
}

//user profile edit and update

const editUserLoad =async(req,res)=>{
    try{
         const id = req.query.id;

        const userData = await User.findById({ _id:id });
        if(userData){
            res.render('edit', { user:userData});
        
        }
        else{
            res.redirect('/admin/newhome');
        }

    }catch(error){
        console.log(error.message);
    }

}

// update profile

const updateProfile =async(req,res)=>{
    try{

            const userData = await User.findByIdAndUpdate({ _id:(req.body.user_id)},{$set:{name:req.body.name, email:req.body.email, mno:req.body.mno, is_varified:req.body.varify  }});
            res.redirect('/admin/dashboard');
        

    }catch(error){
        console.log(error.message);
    }
}

//DELETE USER

const deleteUser = async(req,res)=>{
    try{
        const id = req.query.id;
         await User.deleteOne({ _id:id});
        res.redirect('/admin/dashboard');

    }catch (error){
        console.log(error.message);
    }
}

//export USER

const exportUsersLoad = async(req,res)=>{
    try{
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("My User");

        worksheet.columns= [
            { header:"$ no.", key:"s_no" },
            { header:"Name", key:"name" },
            { header:"Email.", key:"email" },
            { header:"Mobile", key:"mno" },
            { header:"Image", key:"image" },
            { header:"Is Admin", key:"is_admin" },
            { header:"Is Varified", key:"is_varified" }

        ];

        let counter = 1;

        const userData = await User.find({is_admin:0});
 
        userData.forEach((user) => {
            user.s_no = counter;
            worksheet.addRow(user);
            counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold : true};
        });
            
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="users.xlsx"'
        );

        return workbook.xlsx.write(res).then(()=>{
            res.status(200);
        })
        

    }catch (error){
        console.log(error.message);
    }
}
 
// export user in pdf

const exportUsersPdfLoad =async(req,res)=>{
    try{

        const userData = await User.find({is_admin:0});

        const data = {
            users:userData
        }

        const filePathName = path.resolve(__dirname,'../views/admin/htmltopdf.ejs');
        const htmlString = fs.readFileSync(filePathName).toString();

        let options = {
            format:'Letter'
        }

        const ejsdata =  ejs.render(htmlString, data);

        pdf.create(ejsdata,options).toFile('users.pdf',(err, response) =>{
            if(err) console.log(err);

            console.log('file generated');

            const filePath = path.resolve(__dirname,'../users.pdf');

            fs.readFile(filePath,(err,file) =>{
                if (err) {
                    console.log(err);
                    return res.status(500).send('Could not Sowload file');
                } else {
                    
                }

                res.setHeader(
                    "Content-Type",
                    "application/pdf"
                );
        
                res.setHeader(
                    "Content-Disposition",
                    'attachment; filename="users.pdf"'
                );
                res.send(file);

            });
        });

    }catch(error){
        console.log(error.message);
    }

}

module.exports = {
    loginLoad,
    varifyLogin,
    loadnewhome,
    logout,
    forgetLoad,
    forgetvarify,
    forgetPasswordLoad,
    resetPassword,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateProfile,
    deleteUser,
    exportUsersLoad,
    exportUsersPdfLoad
}