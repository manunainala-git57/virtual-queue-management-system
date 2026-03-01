USE virtual_queue_db;

-- ADMIN
INSERT INTO users (name, email, mobile, password, role)
VALUES ('Manu', 'manu@vqms.com', '9999999999', 'manu@123', 'ADMIN');

-- EMPLOYEES
INSERT INTO users (name, email, mobile, password, role) VALUES
('Employee One', 'emp1@vqms.com', '9000000001', 'Emp@123', 'EMPLOYEE'),
('Employee Two', 'emp2@vqms.com', '9000000002', 'Emp@123', 'EMPLOYEE'),
('Employee Three', 'emp3@vqms.com', '9000000003', 'Emp@123', 'EMPLOYEE'),
('Employee Four', 'emp4@vqms.com', '9000000004', 'Emp@123', 'EMPLOYEE'),
('Employee Five', 'emp5@vqms.com', '9000000005', 'Emp@123', 'EMPLOYEE');

-- MAP EMPLOYEES
INSERT INTO employees (user_id, employee_name, avg_service_time) VALUES
(2, 'General Physician', 10),
(3, 'Cardiologist', 15),
(4, 'Dermatologist', 8),
(5, 'Orthopedic', 12),
(6, 'Pediatrician', 7);
