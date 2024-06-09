const express = require("express");
const user_route = express();

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));


const multer = require("multer");
const path = require("path");

user_route.use(express.static('public'));

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

const session = require("express-session");

const config = require("../config/config");

user_route.use(session({secret:config.sessionSecret}));

const auth = require("../middleware/auth");

const userController = require("../controllers/userController");


// for register

user_route.get('/register', auth.isLogout, userController.loadRegister);

// user_route.post('/register',userController.insertUser);

user_route.post('/register', upload.single('image'), userController.insertUser); // after adding multer 



// to varify mail

user_route.get('/varify',userController.varifyMail);


//for login

user_route.get('/',auth.isLogout,userController.loginLoad);

user_route.get('/login', auth.isLogout,userController.loginLoad);


user_route.post('/login',userController.varifyLogin);

//HOME LOAD

user_route.get('/home', auth.isLogin, userController.loadHome);

//logout

user_route.get('/logout',auth.isLogin,userController.userLogout);

//forget password

user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',userController.forgetvarify);

// to reset Password

user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordLoad);

user_route.post('/forget-password',userController.resetPassword);

// resend varification mail

user_route.get('/varification',auth.isLogout,userController.varificationLoad);

user_route.post('/varification',userController.SendVarificationLink);


// profile edit

user_route.get('/edit',auth.isLogin,userController.editLoad);

// profile updte

user_route.post('/edit',upload.single('image'), userController.updateProfile);


module.exports = user_route;

