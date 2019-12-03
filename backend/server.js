const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const uuid = require("uuid-v4");

const Urls = require("./models/urls.js");
const Counter = require("./models/counter.js")

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



// @route POST api/shrink
// @desc Shorten url from user input  
// @access Public

// main route: 
// check if url is already in db upon sending request
// if not, shorten url, insert in db, then send response obj with shortened url
// else, retrieve shortened url from db and send response obj with shortened url 
router.post("/shrink", (req, res) => {
	const longUrl = req.body.longUrl;	// front-end param should be longUrl
	console.log("long url:", longUrl);

	// TASK
	// process url
	// validate url 
	// urlValidator(longUrl)

	// TASK
	// process list of over a thousand urls so I get the interesting looking short urls

	// grab root url, then append encoded portion

	Urls.findOne({ long_url: longUrl }).then((urlDoc) => {

		/**

		grab unique counter from Counter collection, 
		have it encoded in Shrinker, 
		increment unique_counter by 1 
		reinsert/save in Counter collection			
		
		**/

		if (!urlDoc) {
			// if not found in db

			Counter.findOne({ universal_counter: true }).then((counterDoc) => {
				
				if (!counterDoc) {
					// if doesn't exist, then create and insert it

					const counterObj = {
						unique_counter: 0
					}

					const counterRecord = new Counter(counterObj)
					counterDoc = counterRecord;
				}

				counterDoc.unique_counter += 1;
				const docId = counterDoc.unique_counter;
				console.log("Counter Doc incremented unique counter:", counterDoc.unique_counter);
				console.log("docId:", docId);

				const shortUrl = Shrinker.shrink(docId);	// provided encoded short url given unique counter 
				console.log("shortUrl:", shortUrl);

				// counterDoc is either inserted or reinserted
				counterDoc
					.save()
					.then( counterRec => console.log('counter doc inserted into db', counterRec))
					.catch( err => console.log('could not save counter doc to db'));

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


				// send response obj with payload 

				const responseObj = {
					success: true,
					long_url: longUrl,
					short_url: shortUrl
				}

				res.json(responseObj);

			})
			.catch( (err) => console.log('error finding Counter doc in db', err));
		} else {
			// if found in db
			console.log("doc found in db:", urlDoc);

			const responseObj = {
				success: true,
				long_url: urlDoc.long_url,
				short_url: urlDoc.short_url
			}

			res.json(responseObj);

		}

	})
	.catch( (err) => {
		console.log("error finding Urls doc in db: ", err) 
		res.json({ success: false });
	});


});

// @route POST api/:shorturl
// @desc Redirect to short url 
// @access Public

router.get("/:shorturl", (req, res) => {
	// retrieve short url and redirect if in db

	Urls.findOne({ short_url: shorturl}).then((urlDoc) => {
		// if not in db


		// ```${req.protocol}://${req.host}/${short_url}````

	})

});



app.use("/api", router);	// allows react to send api request using "api" in request URL
app.listen(api_port, () => console.log(`Listening to ${api_port}`));
