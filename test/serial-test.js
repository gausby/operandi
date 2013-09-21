/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    serial = require('../lib/serial')
;

var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('A serial process', {
    setUp: function () {
    },
    'should do stuff in the correct order': function (done) {
        var rtn = '';

        function cb() {
            assert.equals('abc', rtn);
            done();
        }

        serial([
            function (done) { rtn += 'a'; done(); },
            function (done) { rtn += 'b'; done(); },
            function (done) { rtn += 'c'; done(); }
        ], cb);

    },
    'should do stuff in the correct order when using asynchronous functions': function (done) {
        var rtn = '';

        function cb() {
            assert.equals('abc', rtn);
            done();
        }

        serial([
            function (done) {
                setTimeout(function() {
                    rtn += 'a';
                    done();
                }, 20);
            },
            function (done) {
                setTimeout(function() {
                    rtn += 'b';
                    done();
                }, 5);
            },
            function (done) {
                setTimeout(function() {
                    rtn += 'c';
                    done();
                }, 1);
            }
        ], cb);

    },

    'should be able to pass the scope to each of the methods': function (done) {
        var scope = { a: '' };

        function cb() {
            assert.equals('132', scope.a);
            done();
        }

        serial.apply(scope, [[
            function (done) { this.a += '1'; done(); },
            function (done) { this.a += '3'; done(); },
            function (done) { this.a += '2'; done(); }
        ], cb]);
    },
    'should just call its callback if no functions is given': function (done) {
        serial([], function () {
            assert(true);
            done();
        });
    },

    'should call the callback with the same scope if a scope is given': function (done) {
        var scope = { foo: 'bar' };

        serial.call(scope, [function(done) { done(); }], function () {
            assert.equals(scope, this);
            done();
        });
    },

    'should call the callback with the same scope if a scope is given and no functions is given': function (done) {
        var scope = { foo: 'bar' };

        serial.call(scope, [], function () {
            assert.equals(scope, this);
            done();
        });
    },

    'should just end its job silently if no callback is given': function (done) {
        refute.exception(function () {
            serial([function (done) { done(); }]);
            done();
        });
    },
    'should just call the noop function if no functions is given and no callback is given': function () {
        refute.exception(function () {
            serial();
        });
    },

    'should stop executing functions if one of them returns an error': function (done) {
        var test = 0;

        function errorHandler () {
            assert.equals(test, 3);
            done();
        }

        // using return instead of throw
        serial([
            function (cb) {
                test += 1;
                return cb();
            },
            function (cb) {
                test += 1;
                return cb();
            },
            function (cb) {
                test += 1;
                return cb(new Error('This should break the execution'));
            },
            function (cb) {
                test += 1;
                return cb();
            }
        ], errorHandler);
    }
});
