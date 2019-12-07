const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const uuid = require("uuid-v4");

var validator = require("validator");

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


// TASK
// Deploy to Heroky to test redirect
// https://medium.com/@basics.aki/deploy-a-mern-stack-application-to-heroku-b9a98b569469
// https://www.youtube.com/watch?v=71wSzpLyW9k

// TASK
// Testing
// Unit testing with Mocha, Chai: https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71
// Chai assertion methods: https://www.chaijs.com/guide/styles/
// Testing requests with Chai HTTP: https://mherman.org/blog/testing-node-js-with-mocha-and-chai/
// React testing: https://medium.com/@houstoncbreedlove/basics-intro-to-testing-react-components-with-mocha-chai-enzyme-and-sinon-c8b82ce58df8

// TASK
// modularize routes: http://catlau.co/how-to-modularize-routes-with-the-express-router/



// @route POST api/shrink
// @desc Shorten url from user input  
// @access Public

// main route: 
// check if url is already in db upon sending request
// if not, shorten url, insert in db, then send response obj with shortened url
// else, retrieve shortened url from db and send response obj with shortened url 
router.post("/shrink", (req, res) => {

	// TASK
	// test: process list of over a thousand urls so I get the interesting looking short urls

	const longUrl = req.body.longUrl;	// front-end param should be longUrl
	console.log("long url:", longUrl);

	// if not valid url
	if (!validator.isURL(longUrl)) {
		res.json({
			success: false,
			error: "Not a valid url"
		})
	}


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
				const urlResponse = {
					doc_id: docId,
					long_url: longUrl,
					short_url: shortUrl
				}

				const urlRecord = new Urls(urlResponse);
			
				urlRecord
					.save()
					.then( urlRec => console.log('url doc saved to db', urlRec))
					.catch( err => console.log('could not save url doc to db'));


				// send response obj with payload 

				const responseObj = {
					success: true,
					long_url: longUrl,
					full_short_url: req.protocol + '://' + req.hostname + '/' + shortUrl
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
// @desc Redirect to long url 
// @access Public

app.get("/:shorturl", (req, res) => {
	// retrieve short url and redirect if in db
	
	// use app.get() instead of router.get() so I don't have to include '/api' in request

	// TASK: see if redirect works once deployed in production
	// troubleshoot "redirect with react js express js"

	const shortUrl = req.params.shorturl;
	console.log("redirect route short url param:", shortUrl);
	/*
	Urls.findOne({ short_url: shortUrl }).then((urlDoc) => {
		if (!urlDoc) {
			res.json({
				success: false,
				error: "Url could not be found"
			})
		} else {
			console.log("redirect route long url:", urlDoc.long_url);
			res.status(301).redirect('https://' + urlDoc.long_url + '/');
		}
	})
	*/

});



app.use("/api", router);	// allows react to send api request using "api" in request URL by appending it to routes with Router
app.listen(api_port, () => console.log(`Listening to ${api_port}`));
