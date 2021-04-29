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

//get employees by manager
router.get('/employee/manager/:id', (req, res) => {
  let params = [req.params.id];
  const sql = `SELECT * FROM employee WHERE manager_id = ?`;
  db.query(sql, params, (err, rows) => {
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

//get employees by department
router.get('/employee/department/:id', (req, res) => {
  let params = req.params.id;
  let sql = `SELECT * FROM department WHERE id = ?`;
  db.query(sql, params, (err, depart) => {
    if (err) {
      res.json('Not a department.');
      return;
    }
    if (depart[0] === undefined) {
      res.json('Department does not exist.');
      return
    } else {
      params = [depart[0].id];
      sql = `SELECT * FROM role WHERE department_id = ?`;
      db.query(sql, params, (err, role) => {
        if (err) {
          res.json('No role found for that department.');
          return;
        }
        params = [role[0].id];
        sql = `SELECT * FROM employee WHERE role_id = ?`;
        db.query(sql, params, (err, rows) => {
          if (err) {
            res.json('No employees found.');

            return;
          }
          res.json(
            {
              message: 'Success!',
              data: rows
            })
        })
      })
    }
  });
});


//total utilized budget
router.get('/budget/:id', (req, res) => {
  let params = [req.params.id];
  let sql = `SELECT department.id,
  role.salary,
  employee.role_id,
  role.department_id
  FROM department
  INNER JOIN role ON department_id = department.id
  INNER JOIN employee ON role_id = role.id
  WHERE department.id = ? 
  `;
  db.query(sql, params, (err, num) => {
    if (err) {
      res.json({ error: err.message });
      return;
    } else {
      let budget = 0;
      for (let i = 0; i < num.length; i++) {
        console.log(parseInt(num[i].salary))
      
        budget += parseInt(num[i].salary);
        console.log(budget);
      }
    
      res.json(
        {
          message: 'The current budget is:',
          data: budget
        }
      )
    }
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
  SET role_id = ?
  WHERE id = ?`;
  const params = [body.role_id, body.id];
  db.query(sql, params, (err, results) => {
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

//update employee manager
router.put(`/manager/:id`, ({ body }, res) => {
  const sql = `UPDATE employee
  SET manager_id =?
  WHERE id = ?`;
  const params = [body.manager_id, body.id];
  db.query(sql, params, (err, results) => {
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