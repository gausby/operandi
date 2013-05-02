/* global assert refute require */
/*jslint maxlen:140*/

var buster = require('buster'),
    parallel = require('../lib/parallel')
;

buster.testCase('A parallel process', {
    'should process each function it gets': function (done) {
        var test = 0;

        function cb() {
            assert.equals(test, 15);
            done();
        }

        parallel([
            function (err, done) { test += 1; done(); },
            function (err, done) { test += 5; done(); },
            function (err, done) { test += 4; done(); },
            function (err, done) { test += 5; done(); }
        ], cb);
    },
    'should pass its scope to each function it gets': function (done) {
        var test = { a: 0 };

        function cb() {
            assert.equals(test.a, 21);
            done();
        }

        parallel.apply(test, [[
            function (err, done) { this.a += 7; done(); },
            function (err, done) { this.a += 7; done(); },
            function (err, done) { this.a += 3; done(); },
            function (err, done) { this.a += 4; done(); }
        ], cb]);

    },
    'should just call the callback function if no functions is given': function (done) {

        function cb() {
            assert(true);
            done();
        }

        parallel([], cb);
    },
    'should just call the noop function if no functions is given and no callback if given': function (done) {
        refute.exception(function () {
            parallel([]);
            done();
        });
    },
    'should just end its task silently if no callback is given': function (done) {
        refute.exception(function () {
            parallel([function (err, done) { done(); }]);
            done();
        });
    }

});
