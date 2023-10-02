const mongoose = require('mysql2');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      unique: true
    },
    lastname: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    conatact_no: {
      type: Number,
      required: true,
      
    }
  },
  {
    timestamps: true,
  }
);

const User = mysql2.model('User', userSchema);

module.exports = User;