-- set pattern for db storage
DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department (
    id INT NOT NULL UNIQUE PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

-- for the manager list, i can sort by which manager ids are null
CREATE TABLE employee (
    id INT NOT NULL UNIQUE AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager) REFERENCES employee(id)
    ON DELETE SET NULL
);

SELECT DATABASE();

SHOW TABLES;