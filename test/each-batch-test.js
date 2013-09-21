/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    each = require('../lib/each-batch.js')
;

var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('A batch each process', {
    setUp: function () {
    },
    'should apply its method til all the elements in the input list': function (done) {
        var list = [1, 2, 3, 4];

        function cb() {
            assert.equals(list, [2, 4, 6, 8]);
            done();
        }

        each(list, function (list, key, done) {
            list[key] *= 2;
            done();
        }, 1, cb);
    },
    'should process its list asynchronous': function (done) {
        var list = ['one', 'two', 'three', 'four'],
            res = [],
            capture
        ;

        function cb() {
            assert.equals(res, ['two', 'three', 'four', 'one']);
            done();
        }

        // trap will 'trap' a callback and a number; every time a
        // trap is 'released' it decrements the release number
        // and run the callback when zero times is left.
        //
        // it simulate an asynchronous situation where the first
        // item in the list hangs longer than all the other items.
        function trap(fn, times) {
            times = times || 0;

            return {
                release: function () {
                    times -= 1;

                    if (times === 0) {
                        fn();
                    }
                }
            };
        }

        each(list, function (list, key, done) {
            if (key === 0) {
                capture = trap(function() {
                    res.push(list[key]);
                    done();
                }, list.length - 1);
            }
            else {
                setTimeout(function() {
                    res.push(list[key]);
                    capture.release();
                    done();
                }, 5 * Math.random());
            }
        }, 2, cb);
    },
    'should be able to have undefined in its list': function (done) {
        var list = [undefined, undefined, undefined];

        function cb() {
            assert.equals(list, ['undefined', 'undefined', 'undefined']);
            done();
        }

        each(list, function (list, key, done) {
            list[key] = typeof list[key];
            done();
        }, 10, cb);
    },

    'should call the callback with the same scope if a scope is given and no list is given': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [], function () {}, 10, function() {
            assert.equals(scope, this);
            done();
        });
    },

    'should call the callback with the same scope if a scope is given': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [1], function (numbers, number, done) { done(); }, 10, function() {
            assert.equals(scope, this);
            done();
        });
    },

    'should pass exceptions to its main callback': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [1], function (numbers, number, done) { done(new Error('test')); }, 10, function(err) {
            assert.isTrue(err instanceof Error);
            done();
        });
    },

    'should apply each function to each key-value pair in an object': function (done) {
        var input = { a: 'a', b: 'b', c: 'c' };

        var callback = function(err) {
            assert.equals(input, {a: 'aa', b: 'bb', c: 'cc'});
            done();
        };

        each(input, function (obj, key, done) {
            obj[key] = obj[key] + obj[key];
            done();
        }, 2, callback);
    }
});
