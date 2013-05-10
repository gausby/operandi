/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    operandi = require('../lib/operandi.js')
;

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;

buster.testCase('Claims made in the README.md', {
    'mapSerial usage example': function (done) {
        var mapSerial = operandi.mapSerial;
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
        mapSerial(arr, square, function () {
            assert.equals(obj, [1, 4, 9, 16, 25, 36]);
            done();
        });
    },

    'mapParallel usage example': function (done) {
        var mapParallel = operandi.mapParallel;
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
        mapParallel(arr, pushToObjAfterRandomTimeout, function () {
            assert.equals(obj.length, 6);
            // something like [ 2, 4, 3, 5, 1, 6 ]
            done();
        });
    },

    'mapBatch usage example': function (done) {
        var mapBatch = operandi.mapBatch;
        var arr = [1, 2, 3, 4, 5, 6];
        var obj = [];

        function pushToObjAfterRandomTimeout(numbers, current, done) {
            setTimeout(function() {
                obj.push(numbers[current]);
                done();
            }, 10 * Math.random());
        }

        mapBatch(arr, pushToObjAfterRandomTimeout, 2, function () {
            assert.equals(obj.length, 6);
            // something like: [ 2, 1, 4, 3, 5, 6 ]
            done();
        });
    }



});
