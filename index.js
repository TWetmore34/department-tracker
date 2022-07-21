const inquirer = require('inquirer');


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
            choices: ['add list of managers']
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
    }
]
}

const answers = inquirer.prompt(questions.start).then((answers) => {
    switch(answers.options){
        case 'Add Employee':
            console.log(answers.options)
            break;
        case 'Update Employee Role':
            console.log(answers.options)
            break;
        case 'View All Roles':
            console.log(answers.options)
            break;
        case 'Add Role':
            console.log(answers.options)
            break;
        case 'View All Departments':
            console.log(answers.options)
            break;
        case 'Add Department':
            console.log(answers.options)
            break;
        case 'Quit':
            return
            break;
    }
});

