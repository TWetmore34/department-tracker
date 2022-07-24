USE company_db
-- how can i display manager id as the manager name?
SELECT employee.id, first_name, role_id, title, salary, dept_name 
FROM employee
JOIN roles ON employee.role_id = roles.id 
JOIN department ON roles.department_id = department.id;
