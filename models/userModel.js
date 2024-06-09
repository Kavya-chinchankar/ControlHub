const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mno: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:''
  },
  password: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Number,
    required: true,
  }, // to check user is admin or not

  is_varified: {
    type: Number,
    default: 0,
  }, // to check user is varified by admin
  token: {
    type: String,
    default: '',
  }
});

module.exports = mongoose.model("user", userSchema);
