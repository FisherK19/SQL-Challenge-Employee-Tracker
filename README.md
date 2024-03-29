# SQL-Challenge-Employee-Tracker

### Description
This is a command-line application that allows users to view and manage departments, roles, and employees within a company. It provides various options such as viewing all departments, roles, and employees, adding new departments, roles, and employees, and updating an employee's role.

### User Story
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

### Acceptance Criteria
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database

### Walkthrough Video:
https://drive.google.com/file/d/1CZ_2tFtXAzk4vwxEculKVz9l9wkwssfP/view

### Screenshot
![CLI screenshot](images/Screenshot%20of%20CLI.png)


## Table of Contents
- [User Story](#user-story)
- [Acceptance Criteria](#acceptance-criteria)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Tests](#tests)
- [Questions](#questions)

### Installation
To use this application, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies using npm install.
3. Create a .env file and add your MySQL database credentials.
4. Run the application using node index.js in your terminal.

## Usage
Upon running the application, follow the prompts to perform various actions such as viewing departments, roles, and employees, adding new entries, or updating existing employee roles.

## Technologies Used
Node.js
MySQL
Inquirer

Github Link: https://github.com/FisherK19/SQL-Challenge-Employee-Tracker


## License
This project is licensed under the MIT License - see the LICENSE file for details.