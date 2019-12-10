const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const server = require('../backend/server.js');

// call external packages
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

	before(function(done){
		
		// connect to database

		// create dummy counter doc to put in Counter collection
		const testCounterDoc = new Counter({
			unique_counter: uniqueCounter
		});

		testCounterDoc.save();
		
		// then put dummy doc with keys {doc_id, long_url, short_url} in Url collection

	});

	after(function(done){
		// remove counter and url dummy docs from collection (be careful to not dump entire collection...)
	})

	it('should return expected shortened url given long url', function(done) {

		// given long url, shrink it using Shrinker.js
		const actualShortUrl = Shrinker.shrink(uniqueCounter);

		// expected output should equal actual shortUrl
		assert('', actualShortUrl);

	})

	it('should return response object with shortened url given long test url', function(done) {
			
		// create shortened url based on test counter using Shrinker.js
		// return response object { success: true, long_url: longUrlInput, short_url: targetShortUrl }
		

		done();
	});

	it('should return test counter doc', function(done) {

	});

	it('should retrieve url test doc in Url collection', function(done) {
		
		// retrieve Url record created in 'before' hook from db
		
	})

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