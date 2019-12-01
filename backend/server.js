const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const uuid = require("uuid-v4");

const Urls = require("./models/urls.js");

const Shrinker = require("./shrinker.js");

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

	// process url
	// validate url 
	// urlValidator(longUrl)

	// grab root url, then append encoded portion

	Urls.findOne({ long_url: longUrl }).then((urlDoc) => {


		if (!urlDoc) {
			// if not found in db

			// generate a locally unique id using UUID
			const docId = uuid();
			console.log("generated docId:", docId);

			// shorten url with module
			// BOOKMARK: since docId is a string, not an int, must find new way of shrinking/encoding long url
			const shortUrl = Shrinker.shrink(docId);	// shrinker module 
			console.log("shortUrl:", shortUrl);

			// insert long url and shortened url as a doc in the db

			const urlObj = {
				doc_id: docId,
				long_url: longUrl,
				short_url: shortUrl
			}

			const urlRecord = new Urls(urlObj);
		
			urlRecord
				.save()
				.then( urlRec => console.log('url doc saved to db', urlRec))
				.catch( err => console.log('could not save url doc to db'));

			// send response obj with shortened url

			const responseObj = {
				success: true,
				long_url: longUrl,
				short_url: shortUrl
			}

			res.json(responseObj);

			// alternative
			// console.log("url doc not found in db");
			// res.status(400).json({ error: "url not found" });
			// return
		} else {
			// if found in db
			console.log("doc found in db:", urlDoc);
			const docId = urlDoc.doc_id;
			console.log("docId:", docId);

			const responseObj = {
				success: true,
				long_url: urlDoc.long_url,
				short_url: urlDoc.short_url
			}

			res.json(responseObj);

		}

	})
	.catch( (err) => {
		console.log("error connecting to db: ", err) 
		res.json({ success: false });
	});



});




app.use("/api", router);	// allows react to send api request using "api" in request URL
app.listen(api_port, () => console.log(`Listening to ${api_port}`));
