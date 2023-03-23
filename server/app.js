const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const algosdk = require('algosdk');

// router
const daoRoutes = require("./routes/daoRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const userRoutes = require("./routes/userRoutes");

require('dotenv').config(); // per variabili d'ambiente (.env)

const app = express();



//connect to mongodb
const dbURI = "***";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(8081))
.catch((err) => console.log(err));

//register view engine
//app.set("view engine", "ejs");

// middleware & static files
app.use(cors());
app.use(express.static('public'));  //rende i file nella cartella 'public' pubblici, utile per i css e immagini
app.use(express.urlencoded({ extended: true }));  //encoding dell'url, lo rende 'leggibile'
app.use(morgan('dev'));  //format dell'output del log delle richieste
app.use(bodyParser.json()); // Per passare dati dal frontend con axios.post
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();  //serve per passare la richieste al prossimo route senza perdere lo stato della richiesta
});

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  // Pass to next layer of middleware
  next();
});

//routes
app.use("/daos", daoRoutes);
app.use("/proposals", proposalRoutes);
app.use("/user", userRoutes);
