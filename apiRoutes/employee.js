const cTable = require('console.table');
const inquirer = require('inquirer');
const express = require('express');
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = require('../../db/connection');

//view all employees, table with employee data, including employee ids, first names, 
//last names, job titles, departments, salaries, and managers that the employees report to
const viewEmployees = () => {
  const sql = `SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, roles.title AS Job_Title, 
  roles.salary AS Salary, department.name AS Department_Name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager_Name
  FROM employee INNER JOIN roles ON roles.id = employee.roles_id
  INNER JOIN department ON department.id = roles.department_id
  LEFT JOIN employee e ON employee.manager_id = e.id`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res);
    return;
  });
  mainMenu();
};

//add employee, prompted to enter the employee’s first name, last name, role, and 
//manager for employee and that employee is added to the database
//show table view all employees to show new employee added
const addEmployee = () => {

  //employee array to select a employee manager from
  let employeeArr = [];
  //database query to get employee id and name
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ',employee.last_name) AS 'Employee_ID' FROM employee;`,
    (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
      res = Object.values(JSON.parse(JSON.stringify(res)));
      //add option to have no manager
      res.push(
        // {
        //   Employee_ID: 'No Manager'
        // }
      );
      //push all employees to array
      for (i = 0; i < res.length; i++) {
        res[i].Employee_ID;
        JSON.stringify(res[i].Employee_ID);
        employeeArr.push(res[i].Employee_ID);
      }

      //for role selection
      let employeeRoleArr = [];
      db.query(`SELECT roles.id, roles.title FROM roles;`,
        (err, ans) => {
          if (err) {
            console.log(err);
          }
          ans = Object.values(JSON.parse(JSON.stringify(ans)));
          for (j = 0; j < ans.length; j++) {
            ans[j].title;
            JSON.stringify(ans[j].title);
            employeeRoleArr.push(ans[j].title);
          }
          inquirer.prompt([
            {
              type: 'input',
              message: 'What is the first name of the employee?',
              name: 'first_name',
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter a first name for the new employee.');
                  return false;
                }
              }
            },
            {
              type: 'input',
              message: 'What is the last name of the new employee?',
              name: 'last_name',
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter the last name of the new employee.')
                  return false;
                }
              }
            },
            {
              type: 'list',
              message: 'Please choose a role for your employee.',
              name: 'roles_id',
              choices: employeeRoleArr,
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter a role id number.');
                  return false;
                }
              }

            },
            {
              type: 'list',
              message: 'Please select your employee`s manager.',
              name: 'manager_id',
              choices: employeeArr,
              validate: nameInput => {
                if (nameInput) {
                  return true;
                } else {
                  console.log('Please enter a manager`s employee id number.');
                  return false;
                }
              }
            }

          ]).then(body => {
            for (j = 0; j < res.length; j++) {
              if (body.manager_id === res[j].Employee_ID) {
                body.manager_id = res[j].id;
              }
            }
            console.log(body.manager_id);

            for (i = 0; i < ans.length; i++) {
              if (body.roles_id === ans[i].title) {
                body.roles_id = ans[i].id
              }
            }
            console.log(body.roles_id);

            const sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
            VALUES (?,?,?,?)`;
            const params = [body.first_name, body.last_name, body.roles_id, body.manager_id];
            db.query(sql, params, (err, result) => {
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
};

//view employee by manager
const viewByManager = () => {
  let managerArray = [];
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ',employee.last_name) AS 'Employee_ID' FROM employee;`,
    (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
      res = Object.values(JSON.parse(JSON.stringify(res)));
      //push all employees to array
      for (i = 0; i < res.length; i++) {
        res[i].Employee_ID;
        JSON.stringify(res[i].Employee_ID);
        managerArray.push(res[i].Employee_ID);
      }
      inquirer.prompt([
        {
          type: 'list',
          name: 'manager_name',
          message: 'Which manager`s employees would you like to view?',
          choices: managerArray,
          validate: input => {
            if (input) {
              return true;
            } else {
              return false;
            }
          }
        }
      ]).then(body => {
        for (j = 0; j < res.length; j++) {
          if (body.manager_name === res[j].Employee_ID) {
            body.id = res[j].id;
          }
        }
        let params = [body.id];
        const sql = `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS Employees FROM employee WHERE employee.manager_id = ?`;
        db.query(sql, params, (err, rows) => {
          if (err) {
            console.log(err);
          }
          console.table(rows);
          mainMenu();
        });
      })
    })
}

//update employee manager
const updateManager = () => {

  let manageArr = [];
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ',employee.last_name) AS 'Employee_Name' FROM employee;`,
    (err, res) => {
      if (err) {
        console.log(err);
        return;
      }

      res = Object.values(JSON.parse(JSON.stringify(res)));

      for (i = 0; i < res.length; i++) {
        console.log(res[i].Employee_Name);
        JSON.stringify(res[i].Employee_Name);
        manageArr.push(res[i].Employee_Name);
      }
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Please select the employee who is under new management.',
          choices: manageArr,
          validate: input => {
            if (input) {
              return true;
            } else {
              return false;
            }
          }
        },
        {
          type: 'list',
          name: 'manager_id',
          message: 'Please select the new manager.',
          choices: manageArr,
          validate: input => {
            if (input) {
              return true;
            } else {
              return false;
            }
          }
        }
      ]).then(body => {
        const sql = `UPDATE employee
        SET manager_id =?
        WHERE id = ?`;
        for (j = 0; j < res.length; j++) {
          if (body.manager_id === res[j].Employee_Name) {
            body.manager_id = res[j].id;
          }
        }
        for (k = 0; k < res.length; k++) {
          if (body.employee_id === res[k].Employee_Name) {
            body.employee_id = res[k].id;
          }
        }
        console.log(body.manager_id);
        console.log(body.employee_id);
        const params = [body.manager_id, body.employee_id];
        db.query(sql, params, (err, results) => {
          if (err) {
            console.log(err);
          } else {
            viewEmployees();
            mainMenu();
          }
        })
      })
    })
}


  










        module.exports = { viewEmployees, addEmployee, viewByManager, updateManager };