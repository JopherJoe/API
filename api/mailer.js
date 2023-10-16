const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.HOST_EMAIL, // Replace with your Gmail email address
    pass: process.env.HOST_PASSWORD, // Replace with your Gmail password or an App Password (if 2FA is enabled)
  },
});

module.exports = transporter;
