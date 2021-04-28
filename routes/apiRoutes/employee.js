const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

//get all employees
router.get('/employee', (req, res) => {
  const sql = `SELECT * FROM employee`
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(
      {
        message: 'Success!',
        data: rows
      })
  });
});

//get single employee
router.get(`/employee/:id`, (req, res) => {
  const sql = `SELECT * FROM employee WHERE id = ?`
  const params = [req.params.id];
  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(
      {
        message: 'Success!',
        data: row
      })
  });
});





module.exports = router;