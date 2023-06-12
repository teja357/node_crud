const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL server');
});

const app = express();
app.use(express.json());

app.post('/createContact', (req, res) => {
  const { first_name, last_name, email, mobile_number } = req.body;

  const sql = 'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)';
  const values = [first_name, last_name, email, mobile_number];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error creating new contact:', err);
      res.status(500).json({ error: 'Failed to create new contact' });
      return;
    }
    res.status(200).json({ message: 'New contact created successfully' });
  });
});

app.get('/getContact/:contact_id', (req, res) => {
    const contactId = req.params.contact_id;
  
    const sql = 'SELECT * FROM contacts WHERE id = ?';
    const values = [contactId];
  
    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error retrieving contact:', err);
        res.status(500).json({ error: 'Failed to retrieve contact' });
        return;
      }
  
      if (results.length > 0) {
        const contact = results[0];
        res.status(200).json(contact);
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    });
  });


  app.post('/updateContact/:contact_id', (req, res) => {
    const contactId = req.params.contact_id;
    const { email, mobile_number } = req.body;
  
    const sql = 'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?';
    const values = [email, mobile_number, contactId];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error updating contact:', err);
        res.status(500).json({ error: 'Failed to update contact' });
        return;
      }
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Contact updated successfully' });
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    });
  });

  app.post('/deleteContact/:contact_id', (req, res) => {
    const contactId = req.params.contact_id;
  
    const sql = 'DELETE FROM contacts WHERE id = ?';
    const values = [contactId];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error deleting contact:', err);
        res.status(500).json({ error: 'Failed to delete contact' });
        return;
      }
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Contact deleted successfully' });
      } else {
        res.status(404).json({ error: 'Contact not found' });
      }
    });
  });
  

const port = 3000; 
app.listen(port, () => {
  console.log(`Server is running on port 3000`);
});
