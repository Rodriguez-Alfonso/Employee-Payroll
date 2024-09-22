const {Pool} = require('pg');
const inquirer = require ('inquirer')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'MiaMadison_001',
    port: 5432,
});

async function jobSection () {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'exit'

            ],
        },
    ]);

    switch (answer.action) {
        case 'view all departments':
            viewDepartments();
            break;
        case 'view all roles':
            viewRoles();
            break;
        case 'view all employees':
            viewEmployees();
            break;
        case 'add a department':
            addDepartment();
            break;
        case 'add a role':
            addRole();
            break;
        case 'add an employee':
            addEmployee();
            break;
        case 'update an employee role':
            updateEmployeeRole();
            break;
        case 'exit':
            process.exit();
            break;
    }
}

async function viewDepartments() {
    const departments = await pool.query('SELECT * FROM department');
    console.table(departments.rows);
    jobSection();
}

async function viewRoles() {
    const roles = await pool.query('SELECT * FROM role');
    console.table(roles.rows);
    jobSection();
}

async function viewEmployees() {
    const employees = await pool.query('SELECT * FROM employee');
    console.table(employees.rows);
    jobSection();
}

async function addDepartment() {
    const department = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
        },
    ]);

    await pool.query('INSERT INTO department (name) VALUES ($1)', [department.name]);
    console.log('Department added!');
    jobSection();
}

async function addRole() {
    const departments = await pool.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map((department) => ({
        name: department.name,
        value: department.id,
    }));

    const role = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the role belong to?',
            choices: departmentChoices,
        },
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [
        role.title,
        role.salary,
        role.department_id,
    ]);
    console.log('Role added!');
    jobSection();
}

async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const employees = await pool.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    managerChoices.unshift({ name: 'None', value: null });

    const employee = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?",
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
        },
        {
            type: 'list',
            name: 'role_id',
            message: "What is the employee's role?",
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: "Who is the employee's manager?",
            choices: managerChoices,
        },
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
        employee.first_name,
        employee.last_name,
        employee.role_id,
        employee.manager_id,
    ]);
    console.log('Employee added!');
    jobSection();
}

async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));

    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map((role) => ({
        name: role.title,
        value: role.id,
    }));

    const employee = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: "Which employee's role do you want to update?",
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'role_id',
            message: "What is the employee's new role?",
            choices: roleChoices,
        },
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [employee.role_id, employee.id]);
    console.log('Employee role updated!');
    jobSection();
}


    jobSection();







