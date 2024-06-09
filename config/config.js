require('dotenv').config()

const sessionSecret = "my secrete";

const emailUser = process.env.EMAILUSER
const emailPassword = process.env.EMAILPASSWORD

module.exports={
    sessionSecret,
    emailPassword,
    emailUser
}