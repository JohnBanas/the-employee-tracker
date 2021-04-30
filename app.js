const cTable = require('console.table');
const inquirer = require('inquirer');
const express = require('express');
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = require('./db/connection');



//prompt functions

//presented with choices: view all departments, view all roles, view all employees,
//add department, add role, add employee, update employee role
const mainMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      message: 'What can I help you do?',
      name: 'selection',
      choices: ['View all the departments in my business.', 'View all the roles in the departments.', 'View all my employees.',
        'I would like to add a new department.', 'Add a new role please.', 'How about we create a new employee?', 'May I change an employee role, please?',
        'I am all done for now, thank you.']
    }
  ])
    .then(answer => {
      switch (answer.selection) {
        case 'View all the departments in my business.':
          viewDept();
          break;
        case 'View all the roles in the departments.':
          viewRoles();
          break;
        case 'View all my employees.':
          viewEmployees();
          break;
        case 'I would like to add a new department.':
          addDepartment();
          break;
        case 'Add a new role please.':
          addRole();
          break;
        case 'How about we create a new employee?':
          console.log('create employee');
          break;
        case 'May I change an employee role, please?':
          console.log('change employee role');
          break;
        case 'I am all done for now, thank you.':
          console.log('exit');
          break;
      }
    })
}


//view all departments, formatted table with department names and ids
const viewDept = () => {
  const sql = `SELECT department.id AS Department_ID, department.name AS Department_Name FROM department`
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    mainMenu();
    return
  });
};

//view all roles, table with job title, role id, 
//the department that role belongs to, and the salary for that role
const viewRoles = () => {
  const sql = `SELECT role.id AS Work_Id, role.title AS Job_Title, role.salary AS Salary, department.name AS Department_Name
  FROM role LEFT JOIN department ON role.department_id = department.id `
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
};

//view all employees, table with employee data, including employee ids, first names, 
//last names, job titles, departments, salaries, and managers that the employees report to
const viewEmployees = () => {
  const sql = `SELECT employee.id AS Employee_ID, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Job_Title, 
  role.salary AS Salary, department.name AS Department_Name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager_Name
  FROM employee INNER JOIN role ON role.id = employee.role_id
  INNER JOIN department ON department.id = role.department_id
  LEFT JOIN employee e ON employee.manager_id = e.id`
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res);
    mainMenu();

  });
};

//add department, prompts enter the name of the department and that department is added to the database
//show table from view all departments with new data
const addDepartment = () => {
  //add inquirer prompt to select department name 
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the new department?',
      name: 'newDepartment',
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          console.log('Please enter a new department.');
          return false;
        }
      }
    }
  ]).then(body => {
    const sql = `INSERT INTO department (name)
  VALUES (?)`;
    const param = [body.newDepartment];
    db.query(sql, param, (err, res) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      viewDept();
    });
  })
};

//add role, prompted to enter the name, salary, and department for the role and 
//that role is added to the database
//show table with roles to show new role added to database
const addRole = () => {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) {
      console.log(err);
      return;
    } else {
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
      const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
      const params = [body.title, body.salary, body.department_id];
      db.query(sql, params, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        viewRoles();
      });
    })
  });
};







mainMenu();
module.exports = { mainMenu, viewDept };








//add role, prompted to enter the name, salary, and department for the role and 
//that role is added to the database
//show table with roles to show new role added to database

//add employee, prompted to enter the employee’s first name, last name, role, and 
//manager for employee and that employee is added to the database
//show table view all employees to show new employee added

//update employee role, prompted to enter the employee’s first name, 
//last name, role, and manager and that employee is added to the database

//bonus: update employee manager, view employee by manager,
//view employee by department, delete department, role, and employee.
//view total budget of a department.