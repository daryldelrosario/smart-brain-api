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
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("You Are Connected!")
});

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));
app.get("/profile/:id", profile.handleProfileGet(db));
app.put("/image", image.handleImage(db));
app.post("/clarifai", clarifai.handleClarifaiCall);

app.get("/test-db", async(req, res) => {
  try {
    const result = await db.raw('SELECT 1+1 AS result');
    res.json(result.rows);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});