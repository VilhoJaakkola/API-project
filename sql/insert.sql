INSERT OR IGNORE INTO project (projectName, pDescription, price) VALUES ('Projekti Alpha', 'Ensimmäinen projekti', 10000.00);
INSERT OR IGNORE INTO project (projectName, pDescription, price) VALUES ('Projekti Beta', 'Toinen projekti', 15000.00);
INSERT OR IGNORE INTO project (projectName, pDescription, price) VALUES ('Projekti Gamma', 'Kolmas projekti', 20000.00);
INSERT OR IGNORE INTO project (projectName, pDescription, price) VALUES ('Projekti Delta', 'Neljäs projekti', 25000.00);
INSERT OR IGNORE INTO project (projectName, pDescription, price) VALUES ('Projekti Epsilon', 'Viides projekti', 30000.00);

INSERT OR IGNORE INTO employee (fname, lname, phone, email, projectWorkingOn) VALUES ('Matti', 'Meikäläinen', '0401234567', 'matti@example.com', 1);
INSERT OR IGNORE INTO employee (fname, lname, phone, email, projectWorkingOn) VALUES ('Liisa', 'Virtanen', '0507654321', 'liisa@example.com', 2);
INSERT OR IGNORE INTO employee (fname, lname, phone, email, projectWorkingOn) VALUES ('Juha', 'Jokinen', '0409876543', 'juha@example.com', 3);
INSERT OR IGNORE INTO employee (fname, lname, phone, email, projectWorkingOn) VALUES ('Sari', 'Sarjakuva', '0501239876', 'sari@example.com', 4);
INSERT OR IGNORE INTO employee (fname, lname, phone, email, projectWorkingOn) VALUES ('Pekka', 'Puupää', '0405678901', 'pekka@example.com', 5);

INSERT OR IGNORE INTO salary (id, employeeId, fname, lname, ehours, salaryPerHour) VALUES (1, 1, 'Matti', 'Meikäläinen', 160, 25.00);
INSERT OR IGNORE INTO salary (id, employeeId, fname, lname, ehours, salaryPerHour) VALUES (2, 2, 'Liisa', 'Virtanen', 160, 30.00);
INSERT OR IGNORE INTO salary (id, employeeId, fname, lname, ehours, salaryPerHour) VALUES (3, 3, 'Juha', 'Jokinen', 160, 27.50);
INSERT OR IGNORE INTO salary (id, employeeId, fname, lname, ehours, salaryPerHour) VALUES (4, 4, 'Sari', 'Sarjakuva', 160, 29.00);
INSERT OR IGNORE INTO salary (id, employeeId, fname, lname, ehours, salaryPerHour) VALUES (5, 5, 'Pekka', 'Puupää', 160, 26.00);
