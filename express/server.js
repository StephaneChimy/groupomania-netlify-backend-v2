'use strict';
// const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
// const app = express();
// const bodyParser = require('body-parser');

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');


const app = express();

const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

// app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

app.use(helmet());
app.use(cors({origin:["https://sc-groupomania.netlify.app", "http://localhost:3001", "https://sc-groupomania-backend.herokuapp.com/"], credentials: true}));
//app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(xss());
// Prevent DOS attacks
app.use(express.json({ limit: '10kb' })); // Body limit is 10kb


app.use("/.netlify/functions/server/api/auth", userRoutes);
app.use("/.netlify/functions/server/api/messages", messageRoutes);
//app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/api/sauces", saucesRoutes);

// module.exports = app;




module.exports = app;
module.exports.handler = serverless(app);
