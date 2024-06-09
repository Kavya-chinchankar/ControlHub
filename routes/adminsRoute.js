const express = require("express");
const admin_route = express();

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({secret:config.sessionSecret}));


const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const auth = require("../middleware/adminAuth");

const adminController = require("../controllers/adminsController");

const multer = require("multer");
const path = require("path");

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload = multer({storage:storage});

//for admin login

admin_route.get('/',auth.isLogout, adminController.loginLoad);

// LOGIN VARIFICATION

admin_route.post('/',adminController.varifyLogin);

// AFTER LOGIN

admin_route.get('/newhome',auth.isLogin, adminController.loadnewhome);

//LOGOUT

admin_route.get('/logout',auth.isLogin,adminController.logout);

// forget Password Load

admin_route.get('/forget', auth.isLogout, adminController.forgetLoad);

admin_route.post('/forget',  adminController.forgetvarify);

// to reset Password

admin_route.get('/forget-password',auth.isLogout,adminController.forgetPasswordLoad);

admin_route.post('/forget-password',adminController.resetPassword);

//dashbord
admin_route.get('/dashboard', adminController.adminDashboard);

// admin_route.get('/dashboard',auth.isLogin, adminController.adminDashboard);

// Add new user
admin_route.get('/new_user',auth.isLogin, adminController.newUserLoad);

admin_route.post('/new_user',upload.single('image'),adminController.addUser);


// profile edit

admin_route.get('/edit',auth.isLogin,adminController.editUserLoad);

// profile updte

admin_route.post('/edit',upload.single('image'), adminController.updateProfile);

// DELETE USER

admin_route.get('/delete-user',adminController.deleteUser);

// eexport user in excel

admin_route.get('/export_users',auth.isLogin, adminController.exportUsersLoad);

// eexport user in pdf

admin_route.get('/export_users-pdf',auth.isLogin, adminController.exportUsersPdfLoad);

admin_route.get('*',function(req,res){
    res.redirect('/admin');
})


module.exports = admin_route;