const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const uuid = require("uuid-v4");
const path = require("path");

const validator = require("validator");

const Urls = require(path.join(__dirname + "/models/urls.js"));
const Counter = require(path.join(__dirname + "/models/counter.js"));

const Shrinker = require(path.join(__dirname + "/shrinker.js"));
const pingHeroku = require(path.join(__dirname + '/ping-heroku.js'));

// INSTANTIATE APP 
const app = express();
const router = express.Router();
const api_port = 3001;

// LOAD MIDDLEWARE
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(cors());

// HEROKU
pingHeroku("https://hospital-cost-map.herokuapp.com/", 900000); // pings every 900 seconds, or 15 minutes

// REACT
// references front-end React for use in Heroku deployment, instead of locally running front-end and back-end with $npm start 
app.use(express.static(path.join(__dirname,"../client/build")));	
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname+"../client/build/index.html"));
});

// DATABASE
// const dbRoute = require("./config/keys.js").mongoURI;	// cloud db url stored in config file
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
// Deploy to Heroku to test redirect
// https://medium.com/@basics.aki/deploy-a-mern-stack-application-to-heroku-b9a98b569469
// add to boilerplate: basic deploy to heroku with node: install heroku; heroku create; git push herokuappname master; heroku buildpacks:set heroku/nodejs; check deployment with heroku ps:scale web=1; heroku open
// add to boilerplate: modify root's package.json so scripts=>start ($npm start) serves backend with refs to react, scripts=> heroku-postbuild ($npm run-script heroku-postbuild) installs frontend after deployment
// can run local build by changing to another script, like script=> local ($npm run-script local)
// change path references by requiring path, then path.join(__dirname + "/<moduledir>")
// change port from just 3001 to app.listen(process.env.PORT || 3001)

// deploy MongoDB cloud to Heroku: 
// https://devcenter.heroku.com/articles/mongolab#connecting-to-existing-mlab-deployments-from-heroku
// https://www.freecodecamp.org/forum/t/how-to-deploy-your-mongodb-app-to-heroku/19347
// use environment variables for sensitive urls like MongoURI
// - hide config key.js maybe remove from github; set environment variable MONGOLAB_URI="<db cloud url>"; refer to process.env.MONGOLAB_URI in server.js; set env var for MONGOLAB_URI in Heroku like so $heroku config:set MONGOLAB_URI="<db cloud url>"



// TASK
// TESTING
// add tutorials and code to boilerplate


// ROUTES
// add to boilerplate

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
						unique_counter: 1
					}

					const counterRecord = new Counter(counterObj)
					counterDoc = counterRecord;
				}

				counterDoc.unique_counter += 1;	// unique counter starts at 2, while test unique counter starts at 1
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
module.exports = app.listen(process.env.PORT || api_port, () => console.log(`Listening to ${api_port}`) );
