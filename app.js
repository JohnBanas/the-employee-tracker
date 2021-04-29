const cTable = require('console.table');
const inquirer = require('inquirer');
const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes/server');

//prompt functions

//presented with choices: view all departments, view all roles, view all employees,
//add department, add role, add employee, update employee role

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