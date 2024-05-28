require('dotenv').config();
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require ('./controllers/image');
const clarifai = require('./controllers/clarifai');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});

const app = express();
app.use(express.json());
app.use(cors());

/*SERVER END POINTS
root (/) --> res = this is working
/signin --> POST = success / fail
/register --> POST = user
/profile/:userId --> GET = user 
/image --> PUT --> user */
app.get("/", (req, res) => {
  res.send("Success")
});


app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfileGet(db));
app.put("/image", image.handleImage(db));
app.post("/clarifai", clarifai.handleClarifaiCall);

app.listen(3001, () => {
  console.log("App is running on port 3001");
});

/* NOTES WHILE DEVELOPING 
// TESTING FUNCTION
// FUNCTION: get all users
// const getAllUsers = () => {
//   db.select('*').from('users').then(data => {
//     console.log("Checking All Users In Postgres Database");
//     console.log(data);
//   });
// }

// BCRYPT EXAMPLE
// let hash = "$2a$10$PiLGCvFzsUcwno2p3fgznejtftUOA51KMo/5tQKhIo1A2WMYT6ZUq";

// bcrypt.compare("apples", hash, function(err, res) {
//   console.log("First Guess: ", res);
// });

// bcrypt.compare("veggies", hash, function(err, res) {
//   console.log("Second Guess: ", res);
// });

// HARDCODED DATABASES
// const database = {
//   users: [
//     {
//       id: "123",
//       name: "John",
//       email: "john@gmail.com",
//       password: "cookies",
//       entries: 0,
//       joined: new Date()
//     },
//     {
//       id: "124",
//       name: "Sally",
//       email: "sally@gmail.com",
//       password: "bananas",
//       entries: 0,
//       joined: new Date()
//     },
//   ]
// }

// FUNCTION: findUserById 
// CREATED before postgres sql was connected
// const findUserById = (id, res, callback) => {
//   const user = database.users.find(user => user.id === id);


//   if(user) {
//     callback(res, user);
//   } else {
//     return res.status(400).json("User Not Found");
//   }
// }
*/
