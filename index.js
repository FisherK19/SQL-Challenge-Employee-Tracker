const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

async function dbConnection(select) {
    try {
        const db = await mysql.createConnection({
            host: "localhost",
            user: dbUser,
            password: dbPassword,
            database: dbName,
        });

        let returnedRowsFromDb = [];
        let returnedOutputFromInq = [];

        switch (select) {
            case "View All Departments":
                returnedRowsFromDb = await db.query("SELECT * FROM departments");
                console.table(returnedRowsFromDb[0]);
                break;

            case "View All Roles":
                returnedRowsFromDb = await db.query("SELECT * FROM roles");
                console.table(returnedRowsFromDb[0]);
                break;

            case "View All Employees":
                returnedRowsFromDb = await db.query("SELECT * FROM employees");
                console.table(returnedRowsFromDb[0]);
                break;

            case "Add a Department":
                returnedOutputFromInq = await inquirer.prompt([
                    {
                        name: "department",
                        message: "Enter New Department Name:",
                    },
                ]);
                await db.query(
                    `INSERT INTO departments (name) VALUES (?)`,
                    [returnedOutputFromInq.department]
                );
                console.log("Department added successfully!");
                break;

                case "Add a Role":
                    returnedOutputFromInq = await inquirer.prompt([
                        {
                            name: "title",
                            message: "Enter New Role Title:",
                        },
                        {
                            name: "salary",
                            message: "Enter Salary for the new role:",
                        },
                        {
                            name: "manager",
                            message: "Enter Manager's Name for the new role:",
                        },
                    ]);
                
                    // Fetch manager's ID based on the provided name
                    const [managerRow] = await db.query(
                        `SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?`,
                        [returnedOutputFromInq.manager]
                    );
                
                    if (!managerRow) {
                        console.log("Error: Manager not found. Please enter a valid manager's name.");
                        break;
                    }
                
                    // Insert the new role into the database
                    await db.query(
                        `INSERT INTO roles (title, salary, manager_id) VALUES (?, ?, ?)`,
                        [returnedOutputFromInq.title, returnedOutputFromInq.salary, managerRow.id]
                    );
                    console.log("Role added successfully!");
                    break;
                

            case "Add an Employee":
                // Prompt for employee details including manager's name
                returnedOutputFromInq = await inquirer.prompt([
                    {
                        name: "firstName",
                        message: "Enter the First Name of the new employee:",
                    },
                    {
                        name: "lastName",
                        message: "Enter the Last Name of the new employee:",
                    },
                    {
                        name: "role",
                        message: "Enter the Role for the new employee:",
                    },
                    {
                        name: "manager",
                        message: "Enter Manager's Name for the new employee:",
                    },
                ]);

                // Fetch role ID based on the provided name
                const [roleRow] = await db.query(
                    `SELECT id FROM roles WHERE title = ?`,
                    [returnedOutputFromInq.role]
                );

                if (!roleRow) {
                    console.log("Error: Role not found. Please enter a valid role.");
                    break;
                }

                // Fetch manager's ID based on the provided name
                const [managerRowEmp] = await db.query(
                    `SELECT id FROM employees WHERE CONCAT(first_name, ' ', last_name) = ?`,
                    [returnedOutputFromInq.manager]
                );

                if (!managerRowEmp) {
                    console.log("Error: Manager not found. Please enter a valid manager's name.");
                    break;
                }

                // Insert the new employee into the database
                await db.query(
                    `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
                    [returnedOutputFromInq.firstName, returnedOutputFromInq.lastName, roleRow.id, managerRowEmp.id]
                );
                console.log("Employee added successfully!");
                break;

            default:
                console.log("Invalid action selected.");
        }

        // Close the database connection after executing the query
        await db.end();
    } catch (error) {
        console.log("Error:", error.message);
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
                    "Update an Employee Role",
                    new inquirer.Separator(),
                    "Quit",
                ],
            },
        ])
        .then(async (res) => {
            // Check if the user selected "Quit"
            if (res.select === "Quit") {
                console.log("Exiting the application.");
                return; // End the function execution
            }

            // Otherwise, call dbConnection() with the selected action
            await dbConnection(res.select);

            // After executing dbConnection(), call userPrompt() again
            userPrompt();
        })
        .catch((error) => {
            console.log(error);
        });
}

// Call the userPrompt() function to start the application
userPrompt();
