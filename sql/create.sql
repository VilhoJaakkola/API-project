CREATE TABLE IF NOT EXISTS employee (
  id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
  fname TEXT NOT NULL,
  lname TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  projectWorkingOn INTEGER,
  FOREIGN KEY (projectWorkingOn) REFERENCES projects(id),
  UNIQUE(fname, lname, email)
);

CREATE TABLE IF NOT EXISTS salary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employeeId INTEGER,
  fname TEXT NOT NULL,
  lname TEXT NOT NULL,
  ehours INTEGER NOT NULL,
  salaryPerHour DECIMAL(10, 2),
  FOREIGN KEY (employeeId) REFERENCES employee(id)
);

CREATE TABLE IF NOT EXISTS project (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  projectName TEXT NOT NULL UNIQUE,
  pDescription TEXT,
  price DECIMAL(10, 2)
);
