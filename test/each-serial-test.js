/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    each = require('../lib/each-serial.js')
;

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
    }
});
