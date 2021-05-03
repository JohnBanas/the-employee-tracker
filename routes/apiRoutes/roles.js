const express = require('express');
const router = express.Router();
const db = require('../../db/connection');






//delete role 
router.delete('/roles/:id', (req, res) => {
  const sql = `DELETE FROM roles WHERE id = ?`
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