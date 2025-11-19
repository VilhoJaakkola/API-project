# API-project
Project made during school course regarding API-tech. Covers basic functionality and sql commands.

Projectfolder has .pdf presentation made of the project during the course.
Files are original, so they include some comments made in finnish.

Original README for the course:
GENERAL

        Author: Vilho Jaakkola <vilho.jaakkola@tuni.fi>
        Date: <2024-03-16; ISO 8601>

DESCRIPTION

        <API-project for course>

        <Server.js file uses express and sqlite for API.
        Includes .sql files for creation of database, insertion
        of example data and deletion of the given example data.
        Commands are given on cmd.>

INSTALL

        <Install NodeJS on cmd for being able to use npm function.
        Then to install express and sqlite3 give command "npm install express sqlite3">

USAGE

        <To start the server go to project directory in
        Cmd and use command "npm run start" to start the server.
        Make sure your port '8000' is free because server will use that as default port.
        After server is started you can use your browser and go to "http://localhost:8000/api/v1/employee",
        where "employee" is just one table used in database.
        Now you have running server on port 8000.
        To manually use .sql-files check /sql/README.txt>

API DESCRIPTION

        <Used api endpoints are /api/v1/'table name'/'search criteria'.
        Available tables in our database are 'employee', 'salary' and 'project'.
        If you don't give any 'search criteria' as in "/api/v1/employee" return json
        will include all data in employee-table.
        You can search by giving id-number (/employee/2) or by giving AND or OR operations
        (OR-operation: /employee/?id=2,3,4,5 AND-operation: /employee/?fname=matti&id=1&projectWorkingOn=1).
        AND-operation will give data that has all criteria matched, OR-operation data that matches any given
        criteria.
        You can also use curl commands to update, post or delete data from tables.>

API EXAMPLES

        <To use curl-commands go to project folder using cmd.
        Here are example calls for GET, POST, PUT and DELETE:
                curl --silent --include "http://localhost:8000/api/v1/employee"
        This curl will return all data from employee-table.
        
                curl -X POST "http://localhost:8000/api/v1/employee" -H "Content-Type: application/json" -d "{\"fname\": \"Esa\", \"lname\": \"Junnila\", \"phone\": \"0401234567\", \"email\": \"esa@example.com\", \"projectWorkingOn\": 1}"
        This will add a compleatly new row in table employee.
        
                curl -X PUT "http://localhost:8000/api/v1/employee" -H "Content-Type: application/json" -d "{\"id\": 1, \"phone\": \"0409876543\", \"projectWorkingOn\": 2}"
        This curl will edit the given data on the given id if that is on the table.
        Before editing you must check the id of the row you want to edit by using the GET-method.
        Also make sure that you have correct elements in your function when adding and editing existing data.

                curl -X DELETE "http://localhost:8000/api/v1/employee/1"
        This curl will delete the item from given table with the given ip.
        Here you must also check the ip by using GET-method first.>
