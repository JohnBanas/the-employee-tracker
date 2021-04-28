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

//add employee to database
router.post('/employee', ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Successfully added candidate!',
      data: body
    });
  });
});

//delete employee
router.delete('/employee/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = ?`
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Sorry, this candidate was not found.'
      });
    } else {
      res.json({
        message: 'Successfully deleted.',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

//update employees role
router.put(`/employee/:id`, ({body}, res) => {
  const sql = `UPDATE employee
  SET first_name = ?,
  last_name =?,
  role_id = ?,
  manager_id =?
  WHERE id = ?`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id, body.id];
  db.query(sql, params, (err, results, fields) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(
      {
        message: 'Success!',
        data: results
      })
  });
});





module.exports = router;