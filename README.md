# Task Manager Web project


This project is a task manager app created using React (front-end) and Node & Express (backend) with a MySQL database to store the user's information as well as their task management data. This is my first full stack react web application project, really found it interesting and enjoyed learning all about the following:

- Sequelize
- Nodemon
- Yup
- Bcrypt
- Express
- Formik
- Axios


## Requirements

Node & NPM


## Instructions on running the app

### Frontend

1. Create a new terminal and change directory to `client/`
2. To install on first download/setup run `npm install`
3. To start make sure your in the client directory and run `npm start`


### Configuring database

1. Download MySQL server to host the server for the database
2. Configure mysql server during installation setup and make the password: "fsp-password123", user: "root", hostname as: "127.0.0.1", and the port as: "3306".
3. Make sure the SQL server is running, you can activate it by looknig for services app in windows and look for the MySQL server and start the server.
4. Download SQL workbench and connect it to the SQL server using credentials you set the server up with in step 3.
5. Create a schema with name "taskmanager_db"


### Backend

1. Create a new terminal and change directory to `server/`
2. To install on first download/setup run `npm install`
3. To start make sure your in the server directory and run `npm start`


