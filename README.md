How to Set Up

cd into front-end
run the following: npm install

cd into server
run the following: npm install

run the following in the root folder: npm install -g concurrently

Create a file in the server folder titled .env
Add the following lines to the file:
DATABASE_HOST=host
DATABASE_USER=user
DATABASE_PASSWORD=password
DATABASE_DATABASE=database

and replace host, user, password, and database as needed

How to Run Project
Run the following in the root directory to run the server and client at the same time: npm start

To run just the server or just the client, run the following command in respective folder: npm start
You can also run the following in the root folder to run just the client: npm run front-end
Or the following to run just the server: npm run server