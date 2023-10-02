const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// get config vars
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.HOST_EMAIL, // Replace with your Gmail email address
    pass: process.env.HOST_PASSWORD, // Replace with your Gmail password or an App Password (if 2FA is enabled)
  },
});

const sendPasswordResetEmail = async (toEmail, resetToken, user) => {
  const mailOptions = {
    from: 'Travel and Tour <monicanituma@gmail.com>',
    to: toEmail,
    subject: 'Password Reset',
    html: `
      <p>Hello ${user.firstname},</p>
      <p>Click the link below to reset your password:</p>
      <a href="http://localhost:4200/reset-password?resetTokenId=${resetToken}">Reset Password Link</a>
      <p>If you did not request this password reset, please ignore this email.</p>
      <p>Thank you!</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true; // Email sent successfully
  } catch (error) {
    console.error('Error sending email:', error);
    return false; // Email sending failed
  }
};

module.exports = {
  sendPasswordResetEmail
};