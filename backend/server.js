const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");

const Urls = require(".models/urls.js")

// INSTANTIATE APP 
const app = express();
const router = express.Router();
const api_port = 3001;

// LOAD MIDDLEWARE
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cors());

// DATABASE
const dbRoute = require("./config/keys.js").mongoURI;	// cloud db url stored in config file
mongoose
	.connect(
		dbRoute,
		{	useNewUrlParser: true,
			useUnifiedTopology: true	// this mongoose version requires this parameter
		},
	)
	.then(() => console.log("connected to MongoDB database"))
	.catch((err) => console.log("error connecting to MongoDB:", err));



// ROUTES

// main route: 
// check if url is already in db upon sending request
// if not, shorten url, insert in db, then send response obj with shortened url
// else, retrieve shortened url from db and send response obj with shortened url 
router.post("/shrink", (req, res) => {
	const longUrl = req.body.longUrl;	// front-end param should be longUrl
	console.log("long url:", longUrl);

	Urls.connect({ long-url: longUrl }).then((urlDoc) => {
		if (!urlDoc) {

			// if not found
			// shorten url with module
			// insert long url and shortened url as a doc in the db
			// send response obj with shortened url

			// alternative
			// console.log("url doc not found in db");
			// res.status(400).json({ error: "url not found" });
			// return
		} else {
			// if found

		}




	});



})




app.use("/api", router);	// allows react to send api request using "api" in request URL
app.listen(api_port, () => console.log(`Listening to ${api_port}`));
