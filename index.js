const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

async function dbConnection(select) {
  let departments = [];

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    let returnedRowsFromDb = [];

    switch (select) {
      case "View All Departments":
        returnedRowsFromDb = await db.query("SELECT * FROM departments");
        console.table(returnedRowsFromDb[0]);
        break;

      case "View All Roles":
        returnedRowsFromDb = await db.query(`
          SELECT
              roles.id,
              roles.title,
              roles.salary,
              departments.name AS department
          FROM roles
          JOIN departments ON roles.department_id = departments.id
        `);
        console.table(returnedRowsFromDb[0]);
        break;

      case "View All Employees":
        returnedRowsFromDb = await db.query(`
          SELECT
              employees.id,
              employees.first_name,
              employees.last_name,
              roles.title AS title,
              departments.name AS department,
              roles.salary AS salary,
              CONCAT(manager.first_name, ' ', manager.last_name) AS manager
          FROM employees
          JOIN roles ON employees.role_id = roles.id
          JOIN departments ON roles.department_id = departments.id
          LEFT JOIN employees AS manager ON employees.manager_id = manager.id
        `);
        console.table(returnedRowsFromDb[0]);
        break;

      case "Add a Department":
        const departmentInput = await inquirer.prompt([
          {
            name: "name",
            message: "Enter the name of the new department:",
          },
        ]);
        await db.query("INSERT INTO departments (name) VALUES (?)", [departmentInput.name]);
        console.log("Department added successfully!");
        break;
        case "Add a Role":
          try {
              const departments = await db.query("SELECT id, name FROM departments");
      
              const roleInput = await inquirer.prompt([
                  {
                      name: "title",
                      message: "Enter the title of the new role:",
                  },
                  {
                      name: "salary",
                      message: "Enter the salary for the new role:",
                  },
                  {
                      type: "list",
                      name: "departmentId",
                      message: "Select the department for the new role:",
                      choices: departments[0].map(department => ({ name: department.name, value: department.id })),
                  },
              ]);
      
              await db.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [
                  roleInput.title,
                  roleInput.salary,
                  roleInput.departmentId,
              ]);
      
              console.log("Role added successfully!");
          } catch (error) {
              console.error("Error adding role:", error.message);
          }
          break;
      

        case "Add an Employee":
          try {
              const roles = await db.query("SELECT id, title FROM roles");
              const managers = await db.query("SELECT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees");
      
              const employeeInput = await inquirer.prompt([
                  {
                      name: "firstName",
                      message: "Enter the First Name of the new employee:",
                  },
                  {
                      name: "lastName",
                      message: "Enter the Last Name of the new employee:",
                  },
                  {
                      type: "list",
                      name: "roleId",
                      message: "Select the Role for the new employee:",
                      choices: roles[0].map(role => ({ name: role.title, value: role.id })),
                  },
                  {
                      type: "list",
                      name: "managerId",
                      message: "Select the Manager for the new employee:",
                      choices: managers[0].map(manager => ({ name: manager.manager_name, value: manager.id })),
                  },
              ]);
      
              await db.query("INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [
                  employeeInput.firstName,
                  employeeInput.lastName,
                  employeeInput.roleId,
                  employeeInput.managerId,
              ]);
      
              console.log("Employee added successfully!");
          } catch (error) {
              console.error("Error adding employee:", error.message);
          }
          break;
      

      default:
        console.log("Invalid selection.");
    }
  } catch (err) {
    console.log(err);
  }
}

function userPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "select",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          new inquirer.Separator(),
          "Quit",
        ],
      },
    ])
    .then(async (res) => {
      await dbConnection(res.select);
      if (res.select !== "Quit") {
        userPrompt();
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

userPrompt();
