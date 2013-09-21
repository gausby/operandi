/* global assert refute require setTimeout */
/*jslint maxlen:140*/

var buster = require('buster'),
    batch = require('../lib/batch.js')
;

var assert = buster.referee.assert;
var refute = buster.referee.refute;

buster.testCase('A batch process', {
    setUp: function () {
    },

    'should call the callback with the same scope if a scope is given and no functions is given': function (done) {
        var scope = { foo: 'bar' };

        batch.call(scope, [], 10, function () {
            assert.equals(scope, this);
            done();
        });
    },

    'should call the callback with the same scope if a scope is given': function (done) {
        var scope = { foo: 'bar' };

        batch.call(scope, [function(done) { done(); }], 10, function () {
            assert.equals(scope, this);
            done();
        });
    },

    'should apply its method til all the elements in the input list': function (done) {
        var rtn = '';

        function cb() {
            assert.equals(rtn, 'runrunrun');
            done();
        }

        batch([
            function (done) { rtn += 'run'; done(); },
            function (done) { rtn += 'run'; done(); },
            function (done) { rtn += 'run'; done(); }
        ], 3, cb);
    },
    'should never run more simultanious processes than specified': function (done) {
        var max = 0,
            functions = [],
            rtn = [],
            i = 5
        ;

        var fn = function (done) {
            setTimeout(function () {
                rtn.push((new Date()).getTime());
                done();
            }, 20);
        };

        for (i = 5; i > 0; i -= 1) {
            functions.push(fn);
        }

        function cb() {
            var len = rtn.length,
                i,
                test = true
            ;

            /* they should arrive in batches of 2, so the 3rd index
             * in the array should be more than 20 seconds apart from
             * the 2nd index in the array */
            for (i = 2; rtn[i]; i += 2) {
                if (rtn[i] - rtn[i - 2] < 20) {
                    test = false;
                }
            }

            /* i don't know about the quality of this unit-test,
             * I would like to see a better way to test for this :-/ */
            assert.isTrue(test);
            done();
        }

        batch(functions, 2, cb);
    }

});
