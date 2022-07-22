const inquirer = require('inquirer');
const mysql = require('mysql2');

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
function addEmployee () {
db.promise().query('SELECT last_name, first_name FROM employee WHERE manager_true = true')
.then((rows) => {
    // creates and returns an array of strings that are firstname lastname
    rows = rows[0]
    let result = []
    for(i=0;i<rows.length;i++){
        let pushMe = `${rows[i].first_name} ${rows[i].last_name}`
        result.push(pushMe);
    }
    return result
})
// sets result to our choices array
.then(res => questions.employee[3].choices = res)
// sets roles arr
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
})
.then(res => questions.employee[2].choices = res))
// after both choices have been set, we ask our inquirer prompt
.then(inquirer.prompt(questions.employee).then(answers => {
    console.log(answers)
}))
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
        inquirer.prompt(questions.updateRole).then((res) => {
            console.log(res)
        })
    })
    )
}

function searchId(table, id) {
    let name = ''
    if(table === 'employee'){
        name = 'first_name, last_name'
    } else if(table === 'roles'){
        name = 'title'
    } else {
        name = 'dept_name'
    }
    db.query(`SELECT ${name}, id FROM ${table}`, (err, res) => {
        if(err) throw err
        for(i=0;i<res.length;i++){
            if(res[i].id === id){
                console.log(res[i])
            }
        }
    })
}

searchId('employee', 5)


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
            choices: ['add list of choices']
        }, {
            type: 'list',
            name: 'manager',
            message: 'Insert employee Manager',
            // once this function is in place, along with the other set of choices, itll just be updating the database with that info
            choices: ['add later']
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
inquirer.prompt(questions.start).then((answers) => {
    switch(answers.options){
        case 'Add Employee':
            addEmployee();
            break;
        case 'Update Employee Role':
            updateEmployee()
            break;
        case 'View All Roles':
            db.query('SELECT * FROM roles;', (err, result) => {
                if(err) throw err;
                // so next we'll need to format this response in the console
                // just kind of assuming thatll be the third npm package they have installed
                console.log(result)
            });
            break;
        case 'Add Role':
            console.log(answers.options)
            break;
        case 'View All Departments':
            db.query('SELECT * FROM department', (err, result) => {
                if(err) throw err;

                console.log(result)
            })
            break;
        case 'Add Department':
            console.log(answers.options)
            break;
        case 'Quit':
            return
            break;
    }
});

