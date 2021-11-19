import {config} from './config.js'
import * as library from './library.js'
import * as permission from './permission.js'
import fs from 'fs'
import express from 'express'
import swagger from 'swagger-ui'
import setup from './setup.js'

//const config = require("./config.js")
//const cors = require("cors");


const app = express();

/*
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
*/


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});