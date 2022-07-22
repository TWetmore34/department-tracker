-- prepopulates test data
INSERT INTO department(dept_name)
VALUES('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO roles(title, salary, department_id)
VALUES ('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, null),
('Josh', 'Dawn', 2, 1),
('Ashley', 'Rodriguez', 3, null),
('Mike', 'Wazowski', 4, 3),
('Sally', 'Sparrow', 5, null),
('Suzan', 'Strong', 6, 5),
('Jeff', 'Winger', 7, null),
('Larry', 'Bird', 8, 7);

