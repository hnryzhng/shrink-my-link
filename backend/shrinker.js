// shrinker.js

var Shrinker = function() {};

Shrinker.shrink = function(docId) => {

	/**
		- convert unique id counter of url doc into shortened url
		- id counter ensures local uniqueness, avoiding collisions if hashed
	**/

	// grab unique id of current doc
	// convert id to shorter string of base 58

	// convert docId to base 10 integer
	num = parseInt(docId, 10);

	// initialize variables for base 58 conversion
	var characters = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'; // excluded 0, I, l, O to avoid confusion
	var base = characters.length;
	var encodedStr = '';

	// loop to convert base 10 number into base 58 string
    while (num) {
        var charIndex = num % base;	// remainder for index of char (maps digit to character position)
        num = Math.floor( num / base );	// divide num by base for further loop processing
        encodedStr += characters[charIndex].toString();	// add encoded char to encodedStr string
    }

    // console.log('encodedStr:', encodedStr);
    return encodedStr;

};

module.exports = Shrinker;

