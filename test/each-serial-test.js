/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    each = require('../lib/each-serial.js')
;

var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('A serial each process', {
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
    'should perform its actions in order': function (done) {
        var list = [0, 0, 0, 0],
            step = 0
        ;

        function cb() {
            assert.equals(list, [1, 2, 3, 4]);
            done();
        }

        each(list, function (list, key, done) {
            step += 1;
            list[key] = step;
            setTimeout(done, Math.random() * 10);
        }, cb);
    },

    'should call the callback with the same scope if a scope is given and no list is given': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [], function () {}, function() {
            assert.equals(scope, this);
            done();
        });
    },

    'should call the callback with the same scope if a scope is given': function (done) {
        var scope = { foo: 'bar' };

        each.call(scope, [1], function (numbers, number, done) { done(); }, function() {
            assert.equals(this, scope);
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
        var scope = { foo: 'bar' }, result = 0;
        function callback () {
            assert.equals(result, 3);
            done();
        }

        each.call(scope, [1,1,1,0,1], function (numbers, key, done) {
            if (numbers[key]) {
                result += numbers[key];
                done();
            }
            else {
                done(new Error('it was zero'));
            }
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
