const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/role', (req, res) => {
  const sql = `SELECT * FROM role`
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

//add role to database
router.post('/role', ({ body }, res) => {
  const sql = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.department_id];
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

//delete role 
router.delete('/role/:id', (req, res) => {
  const sql = `DELETE FROM role WHERE id = ?`
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





module.exports = router;