const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the database connection

router.get('/getAll', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM package_tbl');
    res.json(rows);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/add', async (req, res) => {
  const { destination, no_of_pax, days, nights, add_ons, price } = req.body;

  // Insert a new user into the database
  const sql = 'INSERT INTO package_tbl (destination, no_of_pax, days, nights, add_ons, price) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [destination, no_of_pax, days, nights, add_ons, price];

  try {
    const [result] = await db.execute(sql, values);

    res.status(201).json({ message: 'Package created', id: result.insertId });
  } catch (err) {
    console.error('Error creating package:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
    const packageId = req.params.id;
    const sql = 'DELETE FROM package_tbl WHERE id = ?';
  
    try {
      const [result] = await db.execute(sql, [packageId]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Package not found' });
      } else {
        res.json({ message: 'Package deleted' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params; // Extract user ID from the URL
    const { destination, no_of_pax, days, nights, add_ons, price } = req.body;
  
    // Update the user in the database
    const sql = 'UPDATE package_tbl SET  destination = ?, no_of_pax = ?, days = ?, nights = ?, add_ons = ?, price = ? WHERE id = ?';
    const values = [destination, no_of_pax, days, nights, add_ons, price, id];
  
    try {
      const [result] = await db.execute(sql, values);
  
      if (result.affectedRows === 0) {
        // If no rows were affected, the user does not exist
        return res.status(404).json({ message: 'Package not found' });
      }
  
      res.status(200).json({ message: 'Package updated' });
    } catch (err) {
      console.error('Error updating Package:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;