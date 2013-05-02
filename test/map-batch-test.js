/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    map = require('../lib/map-batch.js')
;

buster.testCase('A batch map process', {
    setUp: function () {
    },
    'should apply its method til all the elements in the input list': function (done) {
        var list = [1, 2, 3, 4];

        function cb() {
            assert.equals(list, [2, 4, 6, 8]);
            done();
        }

        map(list, function (list, key, done) {
            list[key] *= 2;
            done();
        }, 1, cb);
    },
    'should process its list asynchronous': function (done) {
        var list = ['one', 'two', 'three', 'four'],
            res = []
        ;

        function cb() {
            assert.equals(res, ['two', 'three', 'four', 'one']);
            done();
        }

        map(list, function (list, key, done) {
            setTimeout(function () {
                res.push(list[key]);
                done();
            }, key === 0 ? 10 : 1);
        }, 2, cb);
    },
    'should be able to have undefined in its list': function (done) {
        var list = [undefined, undefined, undefined];

        function cb() {
            assert.equals(list, ['undefined', 'undefined', 'undefined']);
            done();
        }

        map(list, function (list, key, done) {
            list[key] = typeof list[key];
            done();
        }, 10, cb);
    }
});
