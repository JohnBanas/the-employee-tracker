const cTable = require('console.table');
const inquirer = require('inquirer');
const express = require('express');
const app = express();
const http = require('http');
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = require('./db/connection');
const router = require('./routes/apiRoutes/server');
const { response } = require('express');

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
          console.log('view dept');
          break;
        case 'View all the roles in the departments.':
          console.log('view roles');
          break;
        case 'View all my employees.':
          console.log('view employees');
          break;
        case 'I would like to add a new department.':
          console.log('add dept');
          break;
        case 'Add a new role please.':
          console.log('add role');
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

const viewDept = () => {
  
}


mainMenu();
module.exports = { mainMenu, viewDept };
//view all departments, formatted table with department names and ids

//view all roles, table with job title, role id, 
//the department that role belongs to, and the salary for that role

//view all employees, table with employee data, including employee ids, first names, 
//last names, job titles, departments, salaries, and managers that the employees report to

//add department, prompts enter the name of the department and that department is added to the database
//show table from view all departments with new data

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