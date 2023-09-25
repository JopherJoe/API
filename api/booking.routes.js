const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the database connection

router.get('/getAll', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM booking_tbl');
    res.json(rows);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/add', async (req, res) => {
  const { firstname, lastname, email, contact_no, departure_date, return_date, no_of_pax_adults, no_of_pax_kids, total_of_bills	
  } = req.body;

  // Insert a new user into the database
  const sql = 'INSERT INTO booking_tbl (firstname, lastname, email, contact_no, departure_date, return_date, no_of_pax_adults, no_of_pax_kids, total_of_bills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [firstname, lastname, email, contact_no, departure_date, return_date, no_of_pax_adults, no_of_pax_kids, total_of_bills];

  try {
    const [result] = await db.execute(sql, values);

    res.status(201).json({ message: 'Booking created', id: result.insertId });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
    const bookingId = req.params.id;
    const sql = 'DELETE FROM booking_tbl WHERE id = ?';
  
    try {
      const [result] = await db.execute(sql, [bookingId]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Booking not found' });
      } else {
        res.json({ message: 'Booking deleted' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params; // Extract user ID from the URL
    const { firstname, lastname, email, contact_no, departure_date, return_date, no_of_pax_adults, no_of_pax_kids, total_of_bills } = req.body;
  
    // Update the user in the database
    const sql = 'UPDATE booking_tbl SET  firstname = ?, lastname = ?, email = ?, contact_no = ?, departure_date = ?, return_date = ?, no_of_pax_adults = ?, no_of_pax_kids = ?, total_of_bills = ? WHERE id = ?';
    const values = [firstname, lastname, email, contact_no, departure_date, return_date, no_of_pax_adults, no_of_pax_kids, total_of_bills, id];
  
    try {
      const [result] = await db.execute(sql, values);
  
      if (result.affectedRows === 0) {
        // If no rows were affected, the user does not exist
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      res.status(200).json({ message: 'Booking updated' });
    } catch (err) {
      console.error('Error updating Booking:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
module.exports = router;