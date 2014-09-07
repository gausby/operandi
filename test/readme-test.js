/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    operandi = require('../lib/operandi.js')
;

var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('Claims made in the README.md', {
    'serial usage example': function (done) {
		var serial = operandi.serial;
		serial([
			function(done) {
				done(undefined, 'bar');
			},
			function(foo, done) {
				assert.equals(foo, 'bar');
				done();
			}
		], done);
	},

    'eachSerial usage example': function (done) {
        var eachSerial = operandi.eachSerial;
        var arr = [1, 2, 3, 4, 5, 6];
        var obj = [];

        function square(numbers, key, done) {
            // setImmediate to simulate something async
            setImmediate(function() {
                obj.push(numbers[key] * numbers[key]);
                done();
            });
        }

        // will run `fn` on every element in the array `listOfElements`,
        // and execute `callback` when it is done.
        eachSerial(arr, square, function () {
            assert.equals(obj, [1, 4, 9, 16, 25, 36]);
            done();
        });
    },

    'eachParallel usage example': function (done) {
        var eachParallel = operandi.eachParallel;
        var arr = [1, 2, 3, 4, 5, 6];
        var obj = [];

        function pushToObjAfterRandomTimeout(numbers, current, done) {
            setTimeout(function() {
                obj.push(numbers[current]);
                done();
            }, 10 * Math.random());
        }

        // will run `fn` on every element in the array `listOfElements`,
        // and execute `callback` when it is done.
        eachParallel(arr, pushToObjAfterRandomTimeout, function () {
            assert.equals(obj.length, 6);
            // something like [ 2, 4, 3, 5, 1, 6 ]
            done();
        });
    },

    'eachBatch usage example': function (done) {
        var eachBatch = operandi.eachBatch;
        var arr = [1, 2, 3, 4, 5, 6];
        var obj = [];

        function pushToObjAfterRandomTimeout(numbers, current, done) {
            setTimeout(function() {
                obj.push(numbers[current]);
                done();
            }, 10 * Math.random());
        }

        eachBatch(arr, pushToObjAfterRandomTimeout, 2, function () {
            assert.equals(obj.length, 6);
            // something like: [ 2, 1, 4, 3, 5, 6 ]
            done();
        });
    },

    'each result in callbacks example': function (done) {
		var eachParallel = operandi.eachParallel;
		eachParallel({a: 1, b: 2, c: 3}, function(obj, key, done) {
			setTimeout(function() {
				done(undefined, obj[key] * 2);
			}, 10 * Math.random());
		}, callback);

		function callback(err, result) {
			assert.equals({a: 2, b: 4, c: 6}, result);
			done();
		}
	},

    'each result in callbacks example for arrays': function (done) {
		var eachParallel = operandi.eachParallel;
		eachParallel([1, 2, 3], function(arr, index, done) {
			setTimeout(function() {
				done(undefined, arr[index] * 2);
			}, 10 * Math.random());
		}, callback);

		function callback(err, result) {
			assert.equals([2, 4, 6], result);
			done();
		}
	},

    'error handling': function (done) {
        var serial = operandi.serial;
        var message = '';

        var process = [
            function (done) {
                message = 'First!';
                done(new Error('The database broke!'));
            },
            function (done) {
                message = 'Second!';
                done();
            }
        ];

        serial(process, function(err) {
            if (err) {
                assert.isTrue(err instanceof Error);
                // handle error
                // message: 'First!'
            }
            done();
        });
    }

});
