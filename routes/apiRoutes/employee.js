const express = require('express');
const router = express.Router();
const db = require('../../db/connection');


db.query(`SELECT * FROM employee`, (err, rows) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log(rows);
});





module.exports = router;