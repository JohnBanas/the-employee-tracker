const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/department', (req, res) => {
  const sql = `SELECT * FROM department`
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

//add department
router.post('/department', ({ body }, res) => {
  const sql = `INSERT INTO department (name)
  VALUES (?)`;
  const param = [body.name];
  db.query(sql, param, (err, result) => {
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

//delete department
router.delete(`/department/:id`, (req, res) => {
  const sql = `DELETE FROM department WHERE id = ?`
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