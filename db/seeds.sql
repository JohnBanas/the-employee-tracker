INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Financial Services and Accounting'),
('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Team Member', 45000, 1),
('Sales Team Lead', 65000, 1),
('Software Engineer', 75000, 2),
('Senior Software Engineer', 95000, 2),
('Accountant', 55000, 3),
('Account Manager', 85000, 3),
('Human Resources', 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Abasam', 2, NULL),
('Jane', 'Abasam', 1, 1),
('Joe', 'Actual', 3, 6),
('Jackie', 'Awesome', 3, 6),
('Jennifer', 'Avidavid', 3, 6),
('Joseph', 'Allstate', 4, NULL),
('Josh', 'Acton', 5, 12),
('Jonah', 'Afernabish', 5, 12),
('Jessica', 'Astel', 5, 12),
('Jasper', 'Angelinco', 3, 6),
('Jim', 'Alinter', 5, 12),
('Jacob', 'Asmat', 6, NULL),
('Jolene', 'Avistor', 7, NULL);