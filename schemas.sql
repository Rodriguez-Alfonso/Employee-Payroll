DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

create table department(
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL
);

create table role(
   id SERIAL PRIMARY KEY,
    title varchar(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

Create table employee(
    id SERIAL PRIMARY KEY,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    role_id int NOT NULL,
    manager_id int
    );
