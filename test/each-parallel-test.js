/* global assert refute require setTimeout setImmediate */
/*jslint maxlen:140*/

var buster = require('buster'),
    each = require('../lib/each-parallel.js')
;

buster.testCase('A parallel each process', {
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
        }, cb);
    },
    'should perform its actions in asynchronous': function (done) {
        var list = [80, 60, 40, 1],
            step = 0
        ;

        function cb() {
            assert.equals(list, [4, 3, 2, 1]);
            done();
        }

        each(list, function (list, key, done) {
            setTimeout(function () {
                step += 1;
                list[key] = step;
                done();
            }, list[key]);
        }, cb);
    },
    'should be able to have undefined in its list': function (done) {
        var list = ['', undefined, 0];

        function cb() {
            assert.equals(list, ['string', 'undefined', 'number']);
            done();
        }

        each(list, function (list, key, done) {
            list[key] = typeof list[key];
            done();
        }, cb);
    },

    'should call the callback with the same scope if a scope is given and no list is given': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [1], function (numbers, number, done) { done(); }, function() {
            assert.equals(scope, this);
            done();
        });
    },

    'should pass exceptions to its main callback': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [1], function (numbers, number, done) { done(new Error('test')); }, function(err) {
            assert.isTrue(err instanceof Error);
            done();
        });
    },

    'should stop calculations if a function throws an error': function (done) {
        var scope = { foo: 'bar' },
            result = 0,
            started = 0
        ;

        function callback () {
            assert.equals(started, 5);
            assert.equals(result, 0);
            done();
        }

        each.call(scope, [1,1,1,0,1], function (numbers, key, done) {
            started += 1;

            setImmediate(function() {
                if (numbers[key]) {
                    setImmediate(function() {
                        result += numbers[key];
                        done();
                    });
                }
                else {
                    done(new Error('it was zero'));
                }
            });
        }, callback);
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
        }, callback);
    }

});
