#chat-app

After cloning the code, please run the following commands

MySql instance details can be changed in `/src/db/db-connection.js` file

1. `$ npm install`

2. `$ docker compose up`

>In the file `/src/db/init-db-sql` sql queries are present to create initial schema and seed data.
Please run these queries on mysql console

3. `$ npm start`

Notes : 

1. Once the service comes up, please visit the url and use the username of one of the user added in the database.
2. Use multiple tabs to login as different users and select a user to chat with




