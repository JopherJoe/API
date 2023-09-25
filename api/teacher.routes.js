/*const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('./mailer'); // Import your Nodemailer configuration

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '120s' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

// Define Teacher API routes here
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email: email });

    if (!teacher) {
      res.status(401).json({ message: 'Incorrect Username' });
      return;
    }

    const isValid = await bcrypt.compare(password, teacher.password);
    if (!isValid) {
      res.status(401).json({ message: 'Incorrect Password' });
    } else {
      // generate a token
      const token = generateAccessToken({ username: email });
      res.status(200).json({ token });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Teacher.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a unique token (e.g., a random string)
    const resetToken = generateRandomToken(); // Implement this function to generate a token
    const tokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Store the token and its expiration time in the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = tokenExpiration;
    
    await user.save();

    // Send a password reset email
    await transporter.sendMail({
      from: 'Gamer One<gamergrim01@gmail.com>', // Replace with your email
      to: user.email,
      subject: 'Password Reset',
      text: `Click this link to reset your password: http://localhost:4000/teachers/reset-password/${resetToken}`,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

function generateRandomToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  return hashResetToken;
}

router.post('/reset-password/:id', async (req, res) => {
  try {
    const resetToken = req.params.id;
    const { oldPassword, newPassword } = req.body;
    const teacher = await Teacher.findOne({ resetPasswordToken: resetToken });
    
    if (!teacher || teacher.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const isValid = await bcrypt.compare(oldPassword, teacher.password);
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Old Password' });
    }

    const isMatch = await bcrypt.compare(newPassword, teacher.password);

    if (isMatch) {
      return res.status(400).json({ message: 'The previous password and the new password must be different.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    teacher.password = hashedPassword;
    teacher.resetPasswordToken = null;
    teacher.resetPasswordExpires = null;
    await teacher.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { firstname, lastname, subjectHandled, department, email, password  } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      firstname,
      lastname,
      subjectHandled,
      department,
      email,
      password: hash
    });

    const savedTeacher = await newTeacher.save();
    res.status(200).json(savedTeacher);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get('/getAll', authenticateToken, async(req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.status(200).json(teachers)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.get('/getMany', async(req, res) => {
  try {
    let body = req.body;
    const teachers = await Teacher.find({ firstname: body.firstname });

    if (teachers.length > 0) {
      res.status(200).json(teachers)
    } else {
      res.send('No matching records found');
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.get('/findById/:id', async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/findByIdAndUpdate/:id', async(req, res) => {
  try {
    let {id} = req.params;
    const teacher = await Teacher.findByIdAndUpdate(id, req.body);
    if(!teacher){
      return res.status(404).json({message: 'cannot find any teacher with that ID'})
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.delete('/findByIdAndDelete/:id', async(req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findByIdAndDelete(teacherId);
    
    if(!teacher){
      return res.status(404).json({message: 'cannot find any student with that ID'})
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.delete('/deleteMany', async (req, res) => {
  try {
    let body = req.body;
    const teachers = await Teacher.find({ firstname: body.firstname });

    if (teachers.length > 0) {
      const result = await Teacher.deleteMany({ firstname: body.firstname });
      res.send(`${result.deletedCount} record(s) deleted`);
    } else {
      res.send('No matching records found to delete');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting data');
  }
});

router.delete('/deleteAll', async (req, res) => {
  try {
    await Teacher.deleteMany({}); // Delete all items from the collection
    res.send('All data deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting data');
  }
})

module.exports = router;*/