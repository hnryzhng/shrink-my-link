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

	const longUrl = "";
	const uniqueCounter = 0;
	const shortUrl = Shrinker.shrink(uniqueCounter);	// create shortened url based on test counter using Shrinker.js

	before(function(done){
		
		// connect to database?

		// create dummy url doc with keys {doc_id, long_url, short_url}
		const testUrlDoc = new Url({
			doc_id: uniqueCounter,
			long_url: longUrl,
			short_url: shortUrl
		});

		// create dummy counter doc to put in Counter collection
		const testCounterDoc = new Counter({
			unique_counter: uniqueCounter
		});

		// insert dummy docs into respective collections
		testUrlDoc.save();
		testCounterDoc.save();

	});

	after(function(done){
		// remove counter and url dummy docs from collection (be careful to not dump entire collection...)
	})


	it('should return expected shortened url given long test url', function(done) {

		// given long url, shrink it using Shrinker.js
		const actualShortUrl = shortUrl;

		// expected output should equal actual shortUrl
		assert('', actualShortUrl);

		done();

	})


	it('should return test counter doc', function(done) {

		done();

	});

	it('should retrieve test url doc', function(done) {
		
		// retrieve Url record created in 'before' hook from db
		
		done();

	})


	it('route should return proper response object given long test url at /shrink GET', function(done) {
		
		// return response object { success: true, long_url: <long test url>, short_url: TYPEOF STRING }

		// response should be json
		// response should return status 200
		// response object should have property 'success'
		// response object should have property 'long_url'
		// response object should have property 'short_url'
		// value for 'success' property should be true
		// value for 'long_url' should be longUrl
		// value for 'short_url' should be shortUrl
		// type for short url should be alphanumeric string
		// short url should have length greater than 0

		done();
	});

})





describe('test redirect given long url');

describe.skip('test routes for shrinking url', function() {
	
	// before(callback), beforeEach(callback)

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


	// after(callback), afterEach(callback)


});