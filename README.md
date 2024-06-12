<H1 align ="center" > CONTROLHUB  </h1>
<h5  align ="center"> 
Fullstack open source By Admin User Management System application made with MongoDB, Express, & Nodejs (MVC) </h5>
<br/>

  * [Configuration and Setup](#configuration-and-setup)
  * [Key Features](#key-features)
  * [Technologies used](#technologies-used)
      - [Frontend](#frontend)
      - [Backend](#backend)
      - [Database](#database)
  * [📸 Screenshots](#screenshots)
  * [📸 Demo](#demo)
  * [Author](#author)

## Configuration and Setup

In order to run this project locally, simply fork and clone the repository or download as zip and unzip on your machine.

- Open the project in your prefered code editor.
- Go to terminal -> New terminal (If you are using VS code)

In the terminal

- Set environment variables in .env 
- Create your mongoDB connection url, which you'll use as your MONGO_URI
- Supply the following credentials

```
#  --- .env  ---
MONGO_URL = YOUR MONGODB URL

EMAILUSER = Your Email
EMAILPASSWORD = Your Password

```
```
# --- Terminal ---

$ npm install (to install dependencies)
$ npm run  start (to start the aplication)
```

##  Key Features

- User registration and login
- Admin registration and login
- Authentication using JWT Tokens
- User searching  and pagination 
- CRUD operations (create, read, update and delete by Admin)
- Upload user ımages to the server
- Responsive Design

<br/>

##  Technologies used

This project was created using the following technologies.

- [Css](https://developer.mozilla.org/en-US/docs/Web/CSS) - For User Interface
- [Node js](https://nodejs.org/en/) -A runtime environment to help build fast server applications using JS
- [Express js](https://www.npmjs.com/package/express) -The server for handling and routing HTTP requests
- [Mongoose](https://mongoosejs.com/) - For modeling and mapping MongoDB data to JavaScript
- [express-async-handler](https://www.npmjs.com/package/express-async-handler) - Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers 
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - For authentication
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs) - For data encryption
- [Nodemailer](https://nodemailer.com/about/) - Send e-mails from Node.js
- [Dotenv](https://www.npmjs.com/package/dotenv) - Zero Dependency module that loads environment variables
- [multer](https://www.npmjs.com/package/multer) - Node.js middleware for uploading files 

####  Database 

 - [MongoDB ](https://www.mongodb.com/) - It provides a free cloud service to store MongoDB collections

 ##  Screenshots

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/6df69883-a909-420a-b2c6-d248226f7408)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/78a85525-cbc2-4d16-8551-de6a672b1c22)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/013ceafb-94bc-46d9-bd8d-88dcd881559f)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/1e6cbca9-9e02-4763-b5fe-209e9691219d)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/b83a69ba-4471-420e-89cd-26a2c5c933bc)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/c5c3d278-f092-405f-8418-2bd94db36165)


admin

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/72cb6f95-25c7-4c43-b92f-c59390a61ff4)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/f7344eb3-0288-4298-ade5-a28cc80b2ae9)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/f08dfaa4-b7f4-4068-baf7-b1d6fb7b0f0b)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/c26c2c87-8346-4a24-bf24-8c6fb3ffe82a)

![image](https://github.com/Kavya-chinchankar/ControlHub/assets/112461154/cbab1e9f-30a4-45c5-ae84-6e154ca8b43d)






