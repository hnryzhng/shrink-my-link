
// TASK
// Testing
// Testing framework with Mocha: https://blog.logrocket.com/a-quick-and-complete-guide-to-mocha-testing-d0e0ea09f09d/
// Unit testing with Mocha, Chai: https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71
// Chai assertion methods: https://www.chaijs.com/guide/styles/
// Testing requests with Chai HTTP: https://mherman.org/blog/testing-node-js-with-mocha-and-chai/
// React testing: https://medium.com/@houstoncbreedlove/basics-intro-to-testing-react-components-with-mocha-chai-enzyme-and-sinon-c8b82ce58df8


const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../backend/server.js');

const Shrinker = require('../backend/shrinker.js');

// call Mongoose models
const Counter = require('../backend/models/counter.js')
const Urls = require('../backend/models/urls.js')

// call chai-http middleware
chai.use(chaiHttp);

// tests

describe('test shrinking of url', function(done) {
	// route: /api/shrink

	const longUrl = "http://longtesturl.com/";
	const uniqueCounter = 1;	// starts at 1 instead of 2 or greater for real url docs
	const shortUrl = Shrinker.shrink(uniqueCounter);	// create shortened url based on test counter using Shrinker.js

	before(function(done){
		
		// delete existing url records?
		//	Urls.deleteMany({}, function(err) {
		//		console.log('deleted docs in url collection');
		//	})

		// create dummy url doc with keys {doc_id, long_url, short_url}
		const testUrlDoc = new Urls({
			doc_id: uniqueCounter,
			long_url: longUrl,
			short_url: shortUrl
		});

		// create dummy counter doc to put in Counter collection
		const testCounterDoc = new Counter({
			unique_counter: uniqueCounter,
			universal_counter: false
		});

		// insert dummy docs into respective collections
		testUrlDoc.save();
		testCounterDoc.save();

		done();

	});

	after(function(done){
		// remove counter and url dummy docs from collection (be careful to not dump entire collection...)
		console.log("TESTS END")
		Counter.deleteOne({ universal_counter: false }).then(console.log("deleted test counter doc"));
		Urls.deleteOne({ long_url: longUrl }).then(console.log("deleted test url doc"));;

		done();

	})


	it('should return expected shortened url given long test url', function(done) {

		// given long url, shrink it using Shrinker.js
		const actualShortUrl = shortUrl;

		// expected output should equal actual shortUrl
		actualShortUrl.should.equal('2')	// input long url: 1 -> shrink(1) -> output short url: '2'

		done();

	})


	it('should return test counter doc', function(done) {
		// retrieve test Counter record created in 'before' hook from db

		Counter.findOne({ universal_counter: false })
			.catch((err) => console.log(err));

		done();

	});

	it('should retrieve test url doc', function(done) {
		
		// retrieve test Url record created in 'before' hook from db
		
		Urls.findOne({ long_url: longUrl })
			.catch((err) => console.log(err));

		done();

	})


	it('route should return proper response object given long test url at /api/shrink POST', function(done) {
		
		// return response object { success: true, long_url: <long test url>, short_url: TYPEOF STRING }

		chai.request(server)
			.post('/api/shrink')
			.send({ longUrl: longUrl })	// request body
			.end(function(err, res) {

				res.should.have.status(200);	// response should return status 200
				res.should.be.json;	// response should be json
				res.body.should.be.a('object');	// response body should be an object
				res.body.should.have.property('success');	// response object should have property 'success'
				res.body.should.have.property('long_url');	// response object should have property 'long_url'
				res.body.should.have.property('short_url');	// response object should have property 'short_url'
				res.body.success.should.equal(true);	// value for 'success' property should be true
				res.body['long_url'].should.equal('http://longtesturl.com/');	// value for 'long_url' should be longUrl
				res.body['short_url'].should.be.a('string');	// type for short url should be alphanumeric string
				res.body['short_url'].should.equal('2');	// value for 'short_url' should be shortUrl

				done();
			})

	});

})





//describe.skip('test redirect given long url', function());




describe.skip('test routes for shrinking url', function() {
	

	it('should return object on api/test-route GET', function(done){
		// api/test-route or just /test-route?

		chai.request(server)
			.get('/test-route')	// api/test-route or just /test-route?
			.end(function(err, res){
				res.should.be.json;	// should return json response object
				res.should.have.status(200);	// should have status 200?
				res.body.should.have.property('success');	// should have success property
				res.body.should.have.property('name');	// should have name property
				res.body.success.should.equal(true);	// success should return true
				res.body.name.should.equal('hi');	// name property should equal 'hi'
			
				done();
			});


	})


});