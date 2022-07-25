// TODO: figure out how to get manager_id to read as manager_name with a join statement
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table')

const db = mysql.createConnection({
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'password1234',
    database: 'company_db'
},
console.log('connected to the database')
);

function addEmployee () {
db.promise().query('SELECT last_name, first_name, id FROM employee WHERE manager_id IS NULL')
.then((rows) => {
    // creates and returns an array of strings that are firstname lastname
    rows = rows[0]
    let result = ['None']
    // creates and sets the result variable = our choices array in questions. 
    for(i=0;i<rows.length;i++){
        let pushMe = `${rows[i].first_name} ${rows[i].last_name}`
        result.unshift(pushMe);
    }
    questions.employee[3].choices = result;
    // returns rows to pass the manager name and ids down for later in the chain
    return rows
})
.then(
    db.promise()
.query('SELECT * FROM ROLES')
.then(rows => {
    // isolates our managers section
    rows = rows[0]

    let result = []
    // does exactly the same as the first for loop, but this time for our roles list
    for(i=0;i<rows.length;i++){
        result.push(rows[i].title);
    }
    questions.employee[2].choices = result
}))
// after both choices have been set, we run our inquirer prompt
.then(rows => {inquirer.prompt(questions.employee).then(({ first_name, last_name, manager, role }) => {
    // get role id from index of role choices + 1
    let roleId = questions.employee[2].choices.indexOf(role) + 1
    // managerId is set as the result of filtering through our manager list - any that return true as having the same first and last name as manager 
    // are set managerId from null to the manager's id (rows[i].id) - we init as null for the case that manager = none
    let managerId = null
    for(i=0;i<rows.length;i++){
    console.log(`${rows[i].first_name} ${rows[i].last_name}`)
        if(`${rows[i].first_name} ${rows[i].last_name}` === manager.trim()){
            managerId = rows[i].id
        }
    }
    db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES(?,?,?,?)`, [first_name, last_name, roleId, managerId]).then(() => {
    console.log(`Added employee ${first_name} ${last_name} to the database!`)
    init()})
})
})
};

function updateEmployee () {
    db.promise().query('SELECT first_name, last_name FROM employee').then((rows) => {
        rows = rows[0]
        let result = []
        // Creates list of names from db
        for(i=0;i<rows.length;i++){
            result.push(`${rows[i].first_name} ${rows[i].last_name}`)
        }
        // set our choices arr equaly to our names list
        questions.updateRole[0].choices = result
    })
    .then(
        db.promise()
        // select all from roles
    .query('SELECT * FROM ROLES')
    .then(rows => {
        // isolates response
        rows = rows[0]
        let result = []
        // Creates list of roles from db
        for(i=0;i<rows.length;i++){
            result.push(rows[i].title);
        }
        // sets choices arr to roles list
        questions.updateRole[1].choices = result
    })
    .then(() => {
        // now that choices are set, call inqurier prompt
        inquirer.prompt(questions.updateRole).then(({ employees, roles }) => {
            // grabs the chosen role and id from the list
            let role = questions.updateRole[1].choices.indexOf(roles) + 1
            let id = questions.updateRole[0].choices.indexOf(employees) + 1
            // updates role
            db.promise().query(`UPDATE employee SET role_id = ${role} WHERE id = ${id}`)
            .then(() => {
                // success message and recalls init function
                console.log(`Updated ${questions.updateRole[0].choices[id-1]}'s role to ${questions.updateRole[1].choices[role-1]}!`)
                init()
            })
        }) 
    })
    )
}
 
function displayAll(table){
    // base case is dept - saves an else if line
    let name = '*'
    let join = ';'
    // if statements alter name and join depending on which table was requested
    if (table === 'roles'){
        name = 'roles.id, title, salary, dept_name'
        join = 'JOIN department ON roles.department_id = department.id'
    } else if (table === 'employee'){
        name = 'employee.id, first_name, title, salary, dept_name, manager_id'
        join = 'JOIN roles ON employee.role_id = roles.id JOIN department ON roles.department_id = department.id'
    }
    // calls for display using set vars from the if block
    db.promise().query(`SELECT ${name} FROM ${table} ${join}`).then(res => {
        res = res[0]
        // makes sure there's space between init function lines and the response
        console.log('\n')
        // creates table for response
        console.table(res)
        // call init() to restart loop
    }).then(() => init())
}

function addDept() {
    // inqurier prompt asks for dept name
    inquirer.prompt(questions.dept).then(answers => {
        // dept name answer sent into db request that inserts new name
        db.promise().query(
            `INSERT INTO department(dept_name) 
            VALUES('${answers.dept}');`)
            .then(() => {
                // confirmation msg
            console.log(`${answers.dept} Department Added`)
            init()
        });
    })
}

function addRole(){
    // grabs list of dept names
    db.promise().query('SELECT dept_name FROM department').then(depts => {
        // isolates response
        depts = depts[0];
        let result = []
        // create list from depts
        for(i=0;i<depts.length;i++){
            result.push(depts[i].dept_name)
        }
        // set list = choices arr
        questions.role[2].choices = result;
    }).then(
        // run inqurier prompt
    inquirer.prompt(questions.role).then(({ role, salary, dept }) => {
        // grabs selected dept
        let dept_id = questions.role[2].choices.indexOf(dept) + 1
        // inserts values into db request
        db.promise().query(
            `INSERT INTO roles(title, salary, department_id)
            VALUES('${role}', ${salary}, '${dept_id}')`)
        .then(() => {
            // confirmation msg and rerun init
            console.log(`${role} Role Added!`)
            init()
        })
    })
    )}
// holds all inquirer questions in an object
let questions = {
    start: [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }
],
    employee: [
        {
            type: 'input',
            name: 'first_name',
            message: 'First Name: '
        }, {
            type: 'input',
            name: 'last_name',
            message: 'Last Name: '
        }, {
            type: 'list',
            name: 'role',
            message: 'Employee Role?',
            choices: ['']
        }, {
            type: 'list',
            name: 'manager',
            message: 'Insert employee Manager',
            // once this function is in place, along with the other set of choices, itll just be updating the database with that info
            choices: []
        }
    ],
    dept: [{
            type: 'input',
            name: 'dept',
            message: 'Input Department Name'
        }],
    role: [{
        type: 'input',
        name: 'role',
        message: 'Input Role Name'
    }, {
        type: 'input',
        name: 'salary',
        message: 'Input Salary'
    }, {
        type: 'list',
        name: 'dept',
        message: 'Which department?',
        choices: ['Add query output for list of departments here']
    }],
    updateRole: [
        {
            type: 'list',
            name: 'employees',
            message: "Which Employee's role would you like to update",
            choices: []
        },{
            type: 'list',
            name: 'roles',
            message: "Which Role will they perform?",
            choices: []
        },

    ]
}

// init function takes response from start questions, and runs each function accordingly
async function init(){
    // if refactoring, could turn this switch statement into an object to help speed
inquirer.prompt(questions.start).then((answers) => {
    switch(answers.options){
        case 'View All Employees':
            displayAll('employee')
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployee();
            break;
        case 'View All Roles':
            displayAll('roles');
            break;
        case 'Add Role':
            addRole();
            break;
        case 'View All Departments':
            displayAll('department');
            break;
        case 'Add Department':
            addDept();
            break;
        case 'Quit':
            return
            break;
    }
})};
init()