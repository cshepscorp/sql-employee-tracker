const mysql = require('mysql2'); // import mysql2
const inquirer = require('inquirer');
// npm install console.table --save
const cTable = require('console.table');
const db = require('./connection');

startSearch = async () => {
    const nextSteps = await inquirer.prompt([
    {
      type: 'list',
      name: 'initialChoice',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Delete an Employee', 'Exit the program'],
    }
  ]);
  switch (nextSteps.initialChoice) {
    case 'View All Departments': // done
      viewAllDepartments();
      break;
    case 'View All Roles': // done
      viewAllRoles();
      break;
    case 'View All Employees': // done
      viewAllEmployees();
      break;
    case 'Add a Department': // done
      addDepartment();
      break;
    case 'Add a Role': // done
      addRole();
      break;
    case 'Add an Employee': // done
      addEmployee();
      break;
    case 'Update an Employee Role': // done
      updateEmployeeRole();
      break;
    case 'Delete an Employee':
      deleteEmployee();
      break;
    case 'Exit the program':
      quit();
      break;
  }
  
  };

  // user presented with a formatted table showing department names and department ids
viewAllDepartments = () => {
  db.query(
    `SELECT * FROM department`,
    function(err, res) {
      console.log("\n");
      console.table(res);  // results contains rows returned by server
      startSearch();
    }
  );
}

// user presented with the job title, role id, the department that role belongs to, and the salary for that role
viewAllRoles = () => {
  db.query(
    `SELECT role.title, role.salary, role.department_id AS dept_id, department.name AS name_of_dept
     FROM role 
     LEFT JOIN department ON department.id = role.department_id
     ORDER BY department_id;`,
    function(err, res) {
      console.log("\n");
      console.table(res);  // results contains rows returned by server
      startSearch();
    }
  );
}

viewAllEmployees = () => {
    db.query(
      `SELECT employee.id, employee.first_name, employee.last_name, role.title,  department.name AS department, role.salary, CONCAT_WS(' ',manager.first_name,manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON department.id = role.department_id
                LEFT JOIN employee manager ON employee.manager_id = manager.id;`,
      function(err, res) {
        console.log("\n");
        console.table(res);  // results contains rows returned by server
        startSearch();
      }
    );
}

// user prompted to enter the name of the department and that department is added to the database
addDepartment = async () => {
  
  const res = await inquirer.prompt([
    {
      type: 'input',
      name: 'deptName',
      message: "What is the name of the department you would like to add?",
      // data validation
      validate: deptNameInput_1 => {
        if (deptNameInput_1) {
          return true;
        } else {
          console.log('Please enter a valid department name');
          return false;
        }
      }
    }
  ]);
  console.log(res);
  const newDept = db.query(
    `INSERT INTO department SET ?`, { name: res.deptName },
    function (err, res_1) {
      if (err)
        throw err;
      console.log("\n");
      console.log("Department has been added");
      console.table(res_1); // results contains rows returned by server
      startSearch();
    }
  );  
}

/* user prompted to enter the name, salary, and department for the role and that role is added to the database */
addRole = async () => {
  // need to allow user to search through existing departments
  let departments = [];

    db.query(`SELECT * FROM department`, (err, rows) => {
      if (err) throw err;
      for (let i = 0; i < rows.length; i++) {
          departments.push({ name: rows[i].name, value: rows[i].id });
      }
    });

  const res = await inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: "What is the name of the role you would like to add?",
      validate: roleNameInput => {
        if (roleNameInput) {
          return true;
        } else {
          console.log('Please enter a valid role name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is the salary for this role? (no commas, please)",
      validate: salaryInput => {
        if (salaryInput) {
          return true;
        } else {
          console.log('Please enter a valid salary amount - e: 100000');
          return false;
        }
      }
    },
    {
      type: 'rawlist',
      name: 'deptName',
      message: "Please select a department for this role",
      choices: departments
    }
  ]);
  // INSERT INTO role (title, salary, department_name)
  const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
  const params = [res.roleName, res.salary, res.deptName];
  console.log(res);
  db.query(sql, params, (err, row) => {
    if (err)
      throw err;
    console.log("\n");
    console.log("Role has been added");
    console.table(res); // results contains rows returned by server
    startSearch();
  }
  );  
}

/* user prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database */
addEmployee = async () => {
  // allow user to search through existing roles
  let roles = [];
    db.query(`SELECT * FROM role`, (err, rows) => {
      if (err) throw err;
          //console.table(rows);  // results contains rows returned by server
      for (let i = 0; i < rows.length; i++) {
        roles.push({ name: rows[i].title, value: rows[i].id });
      }
    });
  // allow user to search through existing roles
  let managers = [];
    db.query(`SELECT CONCAT_WS(' ',employee.first_name,employee.last_name) AS manager, employee.id AS manager_id FROM employee`, (err, rows) => {
      if (err) throw err;
          //console.table(rows);  // results contains rows returned by server
      for (let i = 0; i < rows.length; i++) {
        managers.push({ name: rows[i].manager, value: rows[i].manager_id });
      }
    });

  const res = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the first name of the employee you would like to add?",
      validate: firstNameInput_1 => {
        if (firstNameInput_1) {
          return true;
        } else {
          console.log('Please enter a valid first name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the last name of the employee you would like to add?",
      validate: lastNameInput_1 => {
        if (lastNameInput_1) {
          return true;
        } else {
          console.log('Please enter a valid last name');
          return false;
        }
      }
    },
    {
      type: 'list',
      name: 'roleName',
      message: "Please select a role for this employee",
      choices: roles
    },
    {
      type: 'list',
      name: 'managerName',
      message: "Please select a manager for this employee",
      choices: managers
    }
  ]);
  // INSERT INTO role (first_name, last_name, role_id, manager_id)
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  const params = [res.firstName, res.lastName, res.roleName, res.managerName];
  db.query(sql, params, (err_2, row) => {
    if (err_2)
      throw err_2;
    console.log("\n");
    console.log("Employee has been added");
    startSearch();
  }
  );  
}

// select an employee to update and their new role and this information is updated in the database 
updateEmployeeRole = async () => {
    // allow user to search through existing employees
    let employees = [];
    db.query(`SELECT CONCAT_WS(' ',employee.first_name,employee.last_name) AS employee, employee.id AS employee_id FROM employee`, (err, rows) => {
      if (err) throw err;
      for (let i = 0; i < rows.length; i++) {
        employees.push({ name: rows[i].employee, value: rows[i].employee_id });
      }
    });
  // allow user to search through existing roles
  let roles = [];
    db.query(`SELECT * FROM role`, (err, rows) => {
      if (err) throw err;
      for (let i = 0; i < rows.length; i++) {
        roles.push({ name: rows[i].title, value: rows[i].id });
      }
    });

  const res = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmUpdateEmployee',
      message: 'Would you like to update an employee role?',
      default: true
    },
    {
      type: 'list',
      name: 'employeeName',
      message: "Please select an employee to update",
      choices: employees
    },
    {
      type: 'list',
      name: 'roleName',
      message: "Please select a new role for this employee",
      choices: roles
    }
  ]);
  // UPDATE role based on employee_id
  const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
  const params = [res.roleName, res.employeeName];
  db.query(sql, params, (err_2, row) => {
    if (err_2)
      throw err_2;
    console.log("\n");
    console.log("Employee has been updated");
    startSearch();
  }
  );
}

deleteEmployee = async () => {
     // allow user to search through existing employes
     let employees = [];
     db.query(`SELECT CONCAT_WS(' ',employee.first_name,employee.last_name) AS employee, employee.id AS employee_id FROM employee`, (err, rows) => {
       if (err) throw err;
       for (let i = 0; i < rows.length; i++) {
         employees.push({ name: rows[i].employee, value: rows[i].employee_id });
       }
     });
   // allow user to search through existing roles
   let roles = [];
     db.query(`SELECT * FROM role`, (err, rows) => {
       if (err) throw err;
       for (let i = 0; i < rows.length; i++) {
         roles.push({ name: rows[i].title, value: rows[i].id });
       }
     });
 
   const res = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmDeleteEmployee',
      message: 'Are you sure you would like to delete an employee?',
      default: true
    },
    {
      type: 'list',
      name: 'employeeName',
      message: "Please select an employee to delete",
      choices: employees
    }
  ]);
  // DELETE employee record based on employee_id
  const sql = `DELETE FROM employee WHERE id = ?`;
  const params = [res.employeeName];
  db.query(sql, params, (err_2, row) => {
    if (err_2)
      throw err_2;
    console.log("\n");
    console.log("Employee has been deleted");
    startSearch();
  }
  );
}

quit = () => {
  process.exit();
}

module.exports = { startSearch };