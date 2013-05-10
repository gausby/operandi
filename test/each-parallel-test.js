/* global assert refute require setTimeout */
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
    }
});
