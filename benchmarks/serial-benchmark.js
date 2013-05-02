/* global module require */

var serial = require('../lib/serial');

module.exports = {
    'Serial processes': function(done) {
        var test = function (err, done) {
            switch (Math.round(Math.random())) {
                case 0:
                serial([
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); }
                ], done);
                break;
                case 1:
                serial([
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); },
                    function(err, done) { var test = Math.random() * 100000; done(); }
                ], done);
                break;
            };
        };

        serial([
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test,
            test, test, test, test, test, test, test, test, test, test
        ], done);
    }
};