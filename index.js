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

// this is a nightmare function, but it works!!
// not actually too bad, just a lot of then chaining that can be difficult
// could i turn this into one function for adding anything with just a table parameter and some if statements?
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
    // we dont need to return our roles obj because we can pull those ids from our choices list
}))
// after both choices have been set, we ask our inquirer prompt
.then(rows => {inquirer.prompt(questions.employee).then(answers => {
    // destructures answers
    let { first_name, last_name, manager, role } = answers
    // get role id from index of role choices + 1- we dont need to exclude anything from the roles list, so this works well
    let roleId = questions.employee[2].choices.indexOf(role) + 1
    // managerId is set as the result of filtering through our manager list - any that return true as having the same first and last name as manager 
    // are returned in an array as an object storing the manager names and id
    let managerId = rows.filter(row => {
        if(`${row.first_name} ${row.last_name}` === manager){
            return true
        } 
    })
    if(!managerId) managerID = null
    // accounts for the none option and sets manager_true accordingly
    let manager_true = false;
    if(manager) {
        manager_true = false
    } else if (manager = 'none'){
        manager_true = true
    }
    
    db.promise().query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES(?,?,?,?)`, [first_name, last_name, roleId, managerId[0].id]).then(res => console.log(res)
    ).then(() => init())
})
})
};

function updateEmployee () {
    // Creates list of names from db
    db.promise().query('SELECT first_name, last_name FROM employee').then((rows) => {
        rows = rows[0]
        let result = []
        for(i=0;i<rows.length;i++){
            result.push(`${rows[i].first_name} ${rows[i].last_name}`)
        }
        return result
    })
    // sets name arr, result, to the correct choices set
    .then(res => questions.updateRole[0].choices = res)
    .then(
        db.promise()
    .query('SELECT * FROM ROLES')
    // nested then that creates and returns the arr of roles to questions choices
    .then(rows => {
        rows = rows[0]

        let result = []
        for(i=0;i<rows.length;i++){
            result.push(rows[i].title);
        }
        return result
    }).then(res => questions.updateRole[1].choices = res)
    .then(() => {
        inquirer.prompt(questions.updateRole).then(({ employees, roles }) => {

            let role = questions.updateRole[1].choices.indexOf(roles) + 1
            let id = questions.updateRole[0].choices.indexOf(employees) + 1
            console.log(role)
            console.log(id)
            db.promise().query(`UPDATE employee SET role_id = ${role} WHERE id = ${id}`).then((res) => {
                console.log(res)
            }).then(() => init())
        }) 
    })
    )
}
 
function displayAll(table){
    let name = 'dept_name'
    if (table === 'roles'){
        name = 'title'
    }
    db.promise().query(`SELECT ${name}, id FROM ${table}`).then(res => {
        res = res[0]
        console.table(res)
    }).then(() => init())
}

function addDept() {
    inquirer.prompt(questions.dept).then(answers => {
        db.promise().query(`INSERT INTO department(dept_name) 
        VALUES('${answers.dept}');`).then(() => init());
    })
}

function addRole(){
    db.promise().query('SELECT dept_name FROM department').then(depts => {
        depts = depts[0];
        let result = []

        for(i=0;i<depts.length;i++){
            result.push(depts[i].dept_name)
        }
        questions.role[2].choices = result;
    }).then(
    inquirer.prompt(questions.role).then(({ role, salary, dept }) => {

        let dept_id = questions.role[2].choices.indexOf(dept)
        db.promise().query(`INSERT INTO roles(title, salary, department_id)
        VALUES('${role}', ${salary}, '${dept_id}')`).then(() => init())
    })
    )}

let questions = {
    start: [
    {
        type: 'list',
        name: 'options',
        message: 'What would you like to do?',
        choices: ['Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
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
            choices: ['']
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

// TODO: set up loop back to questions.start after all but quit
// thinking to set up this prompt as a function, then call the function back on a .then at the end of each case
async function init(){
inquirer.prompt(questions.start).then((answers) => {
    switch(answers.options){
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
});
}

init()