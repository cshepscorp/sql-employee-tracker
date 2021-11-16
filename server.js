const db = require('./db/connection');
const inquirer = require('inquirer');
// npm install console.table --save
const cTable = require('console.table');

// constructor
const Employee = require('./lib/Employee');

function startSearch() {
  return inquirer.prompt([
      {
          type: 'list',
          name: 'initialChoice',
          message: 'What would you like to do?',
          choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role'],
        }
    ])
    .then(nextSteps => {
      switch(nextSteps.initialChoice) {
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
          case 'Add an Employee':
              addEmployee();
              break;
          case 'Update an Employee Role':
              updateEmployeeRole();
              break;
      }
    });

};

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
function viewAllDepartments() {
  db.query(
    `SELECT * FROM department`,
    function(err, res) {
      console.log("\n");
      console.table(res);  // results contains rows returned by server
      startSearch();
    }
  );
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
  db.query(
    `SELECT role.title, role.salary, role.department_id AS dept_id, department.name AS name_of_dept
     FROM role
     LEFT JOIN department ON department.id = role.department_id;`,
    function(err, res) {
      console.log("\n");
      console.table(res);  // results contains rows returned by server
      startSearch();
    }
  );
}

function viewAllEmployees() {
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
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment() {
  
  return inquirer.prompt([
    {
      type: 'input',
      name: 'deptName',
      message: "What is the name of the department you would like to add?",
      // data validation
      validate: deptNameInput => {
        if (deptNameInput) {
          return true;
        } else {
          console.log('Please enter a valid department name');
          return false;
        }
      }
    }])
    // push new department into departments db
    .then(function(res){
      console.log(res);
      const newDept = db.query(
        `INSERT INTO department SET ?`, { name: res.deptName },
        function(err, res) {
          if (err) throw err; 
          console.log("\n");
          console.log("Department has been added");
          console.table(res);  // results contains rows returned by server
          startSearch();
        }
      );
    });  
}

/* WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database */
function addRole() {
  // need to allow user to search through existing departments
  let departments = [];

    db.query(`SELECT * FROM department`, (err, rows) => {
      if (err) throw err;
          //console.table(rows);  // results contains rows returned by server
      for (let i = 0; i < rows.length; i++) {
          departments.push({ name: rows[i].name, value: rows[i].id });
      }
      //console.log("\n");
      //console.table(departments);
    });

  return inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: "What is the name of the role you would like to add?",
      // data validation
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
      // data validation
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
  ])
    // push new role into role db
    .then(function(res){
      // INSERT INTO role (title, salary, department_name)
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      const params = [res.roleName, res.salary, res.deptName];
      console.log(res);
      db.query(sql, params, (err, row) => {
          if (err) throw err; 
          console.log("\n");
          console.log("Department has been added");
          console.table(res);  // results contains rows returned by server
          startSearch();
        }
      );
    });
VALUES
  
}

/* WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database */
function addEmployee() {

}

startSearch();

// import routes
// const apiRoutes = require('./routes/apiRoutes'); // Remember that you don't have to specify index.js in the path (e.g., ./routes/apiRoutes/index.js). If the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory.

// // add Express middleware
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// // Add after Express middleware
// app.use('/api', apiRoutes); // By adding the /api prefix here, we can remove it from the individual route expressions after we move them to their new home.


// // Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
//   });

