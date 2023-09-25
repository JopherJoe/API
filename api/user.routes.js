const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the database connection

router.get('/getAll', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM user_tbl');
    res.json(rows);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/add', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Insert a new user into the database
  const sql = 'INSERT INTO user_tbl (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
  const values = [firstname, lastname, email, password];

  try {
    const [result] = await db.execute(sql, values);

    res.status(201).json({ message: 'User created', id: result.insertId });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM user_tbl WHERE id = ?';

  try {
    const [result] = await db.execute(sql, [userId]);
    
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json({ message: 'User deleted' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params; // Extract user ID from the URL
  const { firstname, lastname, email, password } = req.body;

  // Update the user in the database
  const sql = 'UPDATE user_tbl SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?';
  const values = [firstname, lastname, email, password, id];

  try {
    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      // If no rows were affected, the user does not exist
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;