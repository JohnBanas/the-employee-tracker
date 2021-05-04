const cTable = require('console.table');
const inquirer = require('inquirer');
const express = require('express');
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = require('../../db/connection');

//view all roles, table with job title, role id, 
//the department that role belongs to, and the salary for that role
const viewRoles = () => {
  const sql = `SELECT roles.id AS Work_Id, roles.title AS Job_Title, roles.salary AS Salary, department.name AS Department_Name
  FROM roles LEFT JOIN department ON roles.department_id = department.id `
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
};

//add role, prompted to enter the name, salary, and department for the role and 
//that role is added to the database
//show table with roles to show new role added to database
const addRoles = () => {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) {
      console.log(err);
      return;
    } else {
      //returns current departments and id numbers in inquirer prompt
      deptArr = Object.values(JSON.parse(JSON.stringify(res)));
      deptArr = JSON.stringify(deptArr);
      deptArr = deptArr.replace(/\{|\}/g, '', /\(|\)/g, '');
      deptArr = deptArr.replace(/"name"/g, '');
      deptArr = deptArr.replace(/"id"/g, '');
      deptArr = deptArr.replace(/"/g, '');
      deptArr = deptArr.replace(/:/g, ' ');
    }

    inquirer.prompt([
      {
        type: 'input',
        message: 'What would you like the title of this new role to be?',
        name: 'title',
        validate: nameInput => {
          if (nameInput) {
            return true;
          } else {
            console.log('Please enter a new role title.');
            return false;
          }
        }
      },
      {
        type: 'number',
        message: 'What will the new role salary amount be?',
        name: 'salary',
        validate: num => {
          if (num) {
            return true;
          } else {
            console.log('Please enter a valid salary.')
            return false;
          }
        }
      },
      {
        type: 'number',
        message: 'Please enter the id number of a department for the new role. ' + deptArr,
        name: 'department_id'
      }
    ]).then(body => {
      const sql = `INSERT INTO roles (title, salary, department_id)
    VALUES (?,?,?)`;
      const params = [body.title, body.salary, body.department_id];
      db.query(sql, params, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        viewRoles();
        mainMenu();
      });
    })
  });
};

//update employee role, prompted to enter the employee’s first name, 
//last name, role, and manager and that employee is added to the database
//update employees role 
const updateRole = () => {
  let employeeArr = [];
  //database query to get employee id and name
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ',employee.last_name) AS 'Employee_Name' FROM employee;`,
    (err, res) => {
      if (err) {
        console.log(err);
      }


      res = Object.values(JSON.parse(JSON.stringify(res)));
      //push all employees to array
      for (i = 0; i < res.length; i++) {
        res[i].Employee_Name;
        JSON.stringify(res[i].Employee_Name);
        employeeArr.push(res[i].Employee_Name);
      }

      let employeeRoleArr = [];
      db.query(`SELECT roles.id, roles.title FROM roles;`,
        (err, ans) => {
          if (err) {
            console.log(err);
          }
          console.log(ans);
          ans = Object.values(JSON.parse(JSON.stringify(ans)));
          for (j = 0; j < ans.length; j++) {
            ans[j].title;
            JSON.stringify(ans[j].title);
            employeeRoleArr.push(ans[j].title);
          }
          console.log(employeeRoleArr);
          inquirer.prompt([
            {
              type: 'list',
              message: 'Which employee`s role would you like to update?',
              choices: employeeArr,
              name: 'id',
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please select an employee.');
                  return false;
                }
              }
            },
            {
              type: 'list',
              message: 'Please select a new role for the employee.',
              name: 'roles_id',
              choices: employeeRoleArr,
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please select a role for the employee.');
                  return false;
                }
              }
            }
          ]).then(body => {

            for (j = 0; j < res.length; j++) {
              if (body.id === res[j].Employee_Name) {
                body.id = res[j].id;
              }
            }

            for (k = 0; k < ans.length; k++) {
              if (body.roles_id === ans[k].title) {
                body.roles_id = ans[k].id;
              }
            }

            const sql = `UPDATE employee
            SET roles_id = ?
            WHERE id = ?`;
            const params = [body.roles_id, body.id];
            db.query(sql, params, (err, results) => {
              if (err) {
                console.log(err);
                return;
              }
              viewEmployees();
              mainMenu();
            });
          })
        })
    })
}

module.exports = { viewRoles, addRoles, updateRole };