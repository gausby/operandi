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
            function (done) { test += 1; done(); },
            function (done) { test += 5; done(); },
            function (done) { test += 4; done(); },
            function (done) { test += 5; done(); }
        ], cb);
    },
    'should pass its scope to each function it gets': function (done) {
        var test = { a: 0 };

        function cb() {
            assert.equals(test.a, 21);
            done();
        }

        parallel.apply(test, [[
            function (done) { this.a += 7; done(); },
            function (done) { this.a += 7; done(); },
            function (done) { this.a += 3; done(); },
            function (done) { this.a += 4; done(); }
        ], cb]);

    },
    'should just call the callback function if no functions is given': function (done) {

        function cb() {
            assert(true);
            done();
        }

        parallel([], cb);
    },

    'should call the callback with the same scope if a scope is given': function (done) {
        var scope = { foo: 'bar' };

        parallel.call(scope, [function(done) { done(); }], function () {
            assert.equals(scope, this);
            done();
        });
    },

    'should call the callback with the same scope if a scope is given and no functions is given': function (done) {
        var scope = { foo: 'bar' };

        parallel.call(scope, [], function () {
            assert.equals(scope, this);
            done();
        });
    },

    'should just call the noop function if no functions is given and no callback if given': function (done) {
        refute.exception(function () {
            parallel([]);
            done();
        });
    },

    'should just end its task silently if no callback is given': function (done) {
        refute.exception(function () {
            parallel([function (done) { done(); }]);
            done();
        });
    },

    'should stop executing functions if one of them returns an error': function (done) {
        var returned = 0,
            started = 0
        ;

        function errorHandler (err) {
            assert.equals(returned, 3);
            assert.equals(started, 4);
            done();
        }

        // using return instead of throw
        parallel([
            function (cb) {
                started += 1;
                setTimeout(function() {
                    returned += 1;
                    return cb();
                }, 50);
            },
            function (cb) {
                started += 1;
                setTimeout(function() {
                    returned += 1;
                    return cb();
                },5);
            },
            function (cb) {
                started += 1;
                setTimeout(function() {
                    returned += 1;
                    return cb(new Error('test'));
                },20);
            },
            function (cb) {
                started += 1;
                setTimeout(function() {
                    returned += 1;
                    return cb();
                },5);
            }
        ], errorHandler);

    }
});
