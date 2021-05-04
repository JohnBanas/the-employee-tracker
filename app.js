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
        'Let`s update a employee`s manager.', 'View employees by their manager.', 'View employees by their departments.', 'If you need to delete an employee, a department, or a job title, select this option.', 'I am all done for now, thank you.']
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
          addRoles();
          break;
        case 'How about we create a new employee?':
          addEmployee();
          break;
        case 'May I change an employee role, please?':
          updateRole();
          break;
        case 'Let`s update a employee`s manager.':
          updateManager();
          break;
        case 'View employees by their manager.':
          viewByManager();
          break;
        case 'View employees by their departments.':
          viewByDepartment();
          break;
        case 'If you need to delete an employee, a department, or a job title, select this option.':
          deleteFunctions();
          break;
        case 'I am all done for now, thank you.':
          console.log('\n','Goodbye and thank you for using this application.', '\n');
          process.exit();
      }
    })
}


//view all departments, formatted table with department names and ids
const viewDept = () => {
  const sql = `SELECT department.id AS Department_ID, department.name AS Department_Name FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table('\n', rows);
    mainMenu();
    return
  });
};

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
    console.table('\n', rows, '\n');
    mainMenu();
  });
};

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
    console.table('\n', res, '\n');
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
      });
    })
  });
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
      res = Object.values(JSON.parse(JSON.stringify(res)));
      //push all employees to array
      for (i = 0; i < res.length; i++) {
        res[i].Employee_ID;
        JSON.stringify(res[i].Employee_ID);
        employeeArr.push(res[i].Employee_ID);
      }
      employeeArr.push('No Manager');
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
            if (body.manager_id === 'No Manager') {
              body.manager_id = 0;
            }
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

            const sql = `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
            VALUES (?,?,?,?)`;
            const params = [body.first_name, body.last_name, body.roles_id, body.manager_id];
            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              viewEmployees();
            });
          })
        })
    })
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
          ans = Object.values(JSON.parse(JSON.stringify(ans)));
          for (j = 0; j < ans.length; j++) {
            ans[j].title;
            JSON.stringify(ans[j].title);
            employeeRoleArr.push(ans[j].title);
          }
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
            });
          })
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
          }
        })
      })
    })
}

//view employee by manager
const viewByManager = () => {
  let managerArray = [];
  db.query(`SELECT employee.id, CONCAT(employee.first_name, ' ',employee.last_name) AS 'Employee_ID' FROM employee;`,
    (err, res) => {
      if (err) {
        console.log(err);
      }
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
          console.table('\n', rows, '\n');
          mainMenu();
        });
      })
    })
}

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
        console.table('\n', res, '\n');
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'budget',
            message: 'Would you like to see a department budget?'
          }
        ]).then(answer => {
          if (!answer.budget) {
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
                console.table('\n', num, '\n');
                console.log('\n','The current budget is:' + budget, '\n');
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
                    console.log('\n','Successfully deleted ' + answer.employee, '\n');
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
                    console.log('\n','Successfully deleted ' + answer.department, '\n');
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
                    console.log('\n','Successfully deleted ' + answer.roles, '\n');
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




mainMenu();
module.exports = mainMenu;














//bonus: , ,
//, delete department, role, and employee.