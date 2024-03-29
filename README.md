# Purdue Circle

## How to Set Up

- cd into front-end
  - run the following: `npm install`
- cd into server
  - run the following: `npm install`
- run the following in the root folder: `npm install -g concurrently`

- Create a file in the server folder titled .env - Add the following lines to the file:

          DATABASE_HOST=host

          DATABASE_USER=user

          DATABASE_PASSWORD=password

          DATABASE_DATABASE=database

          EMAIL_FROM_USERNAME=address@gmail.com

          EMAIL_PASSWORD=emailpassword

          EMAIL_BASE_URL=http://localhost:3000

          TOKEN_SECRET=secret

          TEST_DATABASE_HOST=

          TEST_DATABASE_USER=

          TEST_DATABASE_PASSWORD=

          TEST_DATABASE_DATABASE=

  - Replace host, user, password, database, email username, and email password as needed
  - To send emails from your own gmail account, you can't use your regular gmail password and will instead need to [generate an App Password](https://support.google.com/accounts/answer/185833?hl=en)

---

## How to Run Project

- Run the following in the root directory to run the server and client at the same time: `npm start`
- To run just the server or just the client, run the following command in respective folder: `npm start`
- You can also run the following in the root folder to run just the client: `npm run front-end`
- Or the following to run just the server: `npm run server`

- To install dependencies in both front-end and server from the root folder, run the following: `npm run i-all`

- To install dependencies in the front-end from the root folder, run the following: `npm run i-front-end`

- To install dependencies in the server from the root folder, run the following: `npm run i-server`

---
