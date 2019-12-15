const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const uuid = require("uuid-v4");
const path = require("path");
const validator = require("validator");

require('dotenv').config();	// load env vars

const Urls = require(path.join(__dirname, "/models/urls.js"));
const Counter = require(path.join(__dirname, "/models/counter.js"));

const Shrinker = require(path.join(__dirname, "/shrinker.js"));
const pingHeroku = require(path.join(__dirname, '/ping-heroku.js'));

// INSTANTIATE APP 
const app = express();
const api_port = process.env.PORT || 3001;

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
// Testing React components: refer to test files for docs

// TASK 
// create backups of db

// TASK
// LOGGING
// https://www.twilio.com/blog/guide-node-js-logging
// http://www.jyotman.xyz/post/logging-in-node.js-done-right

// TASK
// get redirect working, refer to file "REDIRECT_HELP.txt"

// TASK
// scrape 1,000 popular urls, insert into db

// ROUTES
app.use("/api", require("./routes"));	// routes for api requests: root/api/<specific_route>

module.exports = app.listen(api_port, () => console.log(`Listening to ${api_port}`) );
