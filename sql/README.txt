To manually use .sql-files for example to create tables for test data 
go to project folder in wsl and use command "sqlite3 database.db < sql/create.sql". 
This command will execute create.sql file for the database. Also if you want to use other 
.sql files just use the same command but change the sql-filename to the ones you want to execute (insert or delete).
The server.js will on start automatically run create- and insert.sql.
