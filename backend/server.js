const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const uuid = require("uuid-v4");
const path = require("path");
const validator = require("validator");

const Urls = require(path.join(__dirname, "/models/urls.js"));
const Counter = require(path.join(__dirname, "/models/counter.js"));

const Shrinker = require(path.join(__dirname, "/shrinker.js"));
const pingHeroku = require(path.join(__dirname, '/ping-heroku.js'));

// INSTANTIATE APP 
const app = express();
const router = express.Router();
const api_port = 3001;

// LOAD MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// HEROKU
pingHeroku("https://shrink-my-link.herokuapp.com/", 900000); // pings every 900 seconds, or 15 minutes

// REACT
// references front-end React for use in Heroku deployment, instead of locally running front-end and back-end with $npm start 
app.use(express.static(path.join(__dirname,"../client/build")));	
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname,"/../client/build/index.html"));
});

// DATABASE 
const dbRoute = process.env.MONGOLAB_URI;
console.log("db route:", dbRoute);
mongoose
	.connect(
		dbRoute,
		{	useNewUrlParser: true,
			useUnifiedTopology: true	// this mongoose version requires this parameter
		},
	)
	.then(() => console.log("connected to MongoDB database"))
	.catch((err) => console.log("error connecting to MongoDB:", err));

// TASK
// TESTING
// add tutorials and code to boilerplate
// server.js: call/serve React scripts,  module.exports = app.listen(), env vars for port 


// TASK
// ROUTES
// add to boilerplate
// modularize routes: http://catlau.co/how-to-modularize-routes-with-the-express-router/

// TASK 
// creating backups of db

// TASK
// UPDATE MERN BOILERPLATE

// ROUTES
app.use("/api", require("./routes"));	// routes for api requests: root/api/<specific_route>

module.exports = app.listen(process.env.PORT || api_port, () => console.log(`Listening to ${api_port}`) );
