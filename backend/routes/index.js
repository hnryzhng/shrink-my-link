// routes/index.js


const path = require("path");
const validator = require("validator");

var router = require('express').Router();

const Urls = require(path.join(__dirname, "..", "/models/urls.js"));
const Counter = require(path.join(__dirname, "..", "/models/counter.js"));

const Shrinker = require(path.join(__dirname, "..", "/shrinker.js"));


// @route POST api/shrink
// @desc Shorten url input 
// @access Public

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
				full_short_url: req.protocol + '://' + req.hostname + '/' + urlDoc.short_url
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

router.get("/convert/:shorturl", (req, res) => {
	// retrieve short url and redirect if in db
	
	// TASK
	// troubleshoot
	// https://stackoverflow.com/questions/54503380/getting-url-parameter-from-react-to-node


	// troubleshoot "redirect with react js express js"

	const shortUrl = req.params.shorturl;
	
	console.log("redirect route short url param:", shortUrl);
	
	/*
	Urls.findOne({ short_url: shortUrl }).then( function(urlDoc) {
		if (!urlDoc) {
			res.json({
				success: false,
				error: "Url could not be found"
			})
		} else {
			const fullLongUrl = "https://" + urlDoc.long_url;
			console.log("redirect route long url:", fullLongUrl);
			res.redirect(fullLongUrl);
		}
	})
	*/

});



module.exports = router;