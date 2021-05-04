const cTable = require('console.table');
const inquirer = require('inquirer');
const express = require('express');
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = require('../../db/connection');

//view all departments, formatted table with department names and ids
const viewDept = () => {
  const sql = `SELECT department.id AS Department_ID, department.name AS Department_Name FROM department`;
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
      mainMenu();
    });
  })
};

//view employee by department
//view total budget of a department
const viewByDepartment = () => {
  let deptArray = [];
  let sql = `SELECT department.id , department.name FROM department`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err)
    }
    res = Object.values(JSON.parse(JSON.stringify(res)));
    //push all employees to array
    for (i = 0; i < res.length; i++) {
      res[i].Employee_ID;
      JSON.stringify(res[i].name);
      deptArray.push(res[i].name);
    }


    inquirer.prompt([
      {
        type: 'list',
        name: 'dept',
        message: 'Which department would you like to view?',
        choices: deptArray,
        validate: input => {
          if (input) {
            return true;
          } else {
            return false;
          }
        }
      }
    ]).then(body => {
      for (i = 0; i < res.length; i++) {
        if (body.dept === res[i].name) {
          body.id = res[i].id;
        }
      }
      params = body.id;
      let sqlTwo = `SELECT CONCAT(employee.first_name,' ', employee.last_name) AS 'Employee',  department.name AS 'Department',
  roles.title AS 'Title' FROM employee INNER JOIN roles ON roles.id = employee.roles_id
  INNER JOIN department ON department.id = roles.department_id WHERE department.id = ?`;
      db.query(sqlTwo, params, (err, res) => {
        if (err) {
          console.log(err);
        }
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'budget',
            message: 'Would you like to see a department budget?'
          }
        ]).then(answer => {
          if (!answer) {
            mainMenu();
          } else {
            let sqlThree = `SELECT department.id,
              roles.salary, employee.roles_id, roles.department_id
              FROM department
              INNER JOIN roles ON department_id = department.id
              INNER JOIN employee ON roles_id = roles.id
              WHERE department.id = ?`;
            db.query(sqlThree, params, (err, num) => {
              if (err) {
                console.log(err)
              } else {
                let budget = 0;
                for (let i = 0; i < num.length; i++) {
                  budget += parseInt(num[i].salary);
                }
                console.table(num);
                console.log('The current budget is:' + budget);
                mainMenu();
              }
            })
          }
        })
      })
    })
  })
}

const deleteFunctions = () => {
  let employeeArr = [];
  let departmentArr = [];
  let roleArr = [];

  sqlEmployee = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS 'Employee' FROM employee;`;
  db.query(sqlEmployee, (err, resEmployee) => {
    if (err) {
      console.log(err);
    }
    resEmployee = Object.values(JSON.parse(JSON.stringify(resEmployee)));
    for (i = 0; i < resEmployee.length; i++) {
      resEmployee[i].Employee;
      JSON.stringify(resEmployee[i].Employee);
      employeeArr.push(resEmployee[i].Employee);
    }
    sqlDept = `SELECT department.id, department.name AS 'Department' FROM department;`;
    db.query(sqlDept, (err, resDept) => {
      if (err) {
        console.log(err);
      }

      resDept = Object.values(JSON.parse(JSON.stringify(resDept)));
      for (j = 0; j < resDept.length; j++) {
        resDept[j].Department;
        JSON.stringify(resDept[j].Department);
        departmentArr.push(resDept[j].Department);
      }
      sqlRole = `SELECT roles.id, roles.title AS 'Job_Title' FROM roles;`;
      db.query(sqlRole, (err, resRole) => {
        if (err) {
          console.log(err);
        }
        resRole = Object.values(JSON.parse(JSON.stringify(resRole)));
        for (k = 0; k < resRole.length; k++) {
          resRole[k].Job_Title;
          JSON.stringify(resRole[k].Job_Title);
          roleArr.push(resRole[k].Job_Title);
        }

        inquirer.prompt([
          {
            type: 'list',
            name: 'choice',
            message: 'What would you like to delete today?',
            choices: ['Employee', 'Department', 'Job Role']
          }
        ]).then(answer => {
          switch (answer.choice) {
            case 'Employee':
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'employee',
                  message: 'Please select a employee to delete.',
                  choices: employeeArr
                }
              ]).then(answer => {
                for (i = 0; i < resEmployee.length; i++) {
                  if (answer.employee === resEmployee[i].Employee) {
                    answer.id = resEmployee[i].id;
                  }
                }
                params = [answer.id];
                db.query(`DELETE FROM employee WHERE id = ?`, params, (err, resEmp) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Successfully deleted ' + answer.employee);
                    mainMenu();
                  }
                })
              })
              break;
            case 'Department':
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'department',
                  message: 'Please select a department to delete.',
                  choices: departmentArr
                }
              ]).then(answer => {
                for (j = 0; j < resDept.length; j++) {
                  if (answer.department === resDept[j].Department) {
                    answer.id = resDept[j].id;
                  }
                }
                params = [answer.id];
                db.query(`DELETE FROM department WHERE id = ?`, params, (err, resEmp) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Successfully deleted ' + answer.department);
                    mainMenu();
                  }
                })
              })
              break;
            case 'Job Role':
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'roles',
                  message: 'Please select a role to delete.',
                  choices: roleArr
                }
              ]).then(answer => {
                for (k = 0; k < resRole.length; k++) {
                  if (answer.roles === resRole[k].Job_Title) {
                    answer.id = resRole[k].id;
                  }
                }
                params = [answer.id];
                db.query(`DELETE FROM roles WHERE id = ?`, params, (err, resEmp) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Successfully deleted ' + answer.roles);
                    mainMenu();
                  }
                })
              })
              break;
          }

        })

      })

    })

  })
}

module.exports = { viewDept, addDepartment, viewByDepartment, deleteFunctions};