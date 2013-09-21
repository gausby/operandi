/* global module require */

var serial = require('../lib/serial');

module.exports = {
    'name': 'Serial processes',
    'fn': function(done) {
        var test = function (done) {
            switch (Math.round(Math.random())) {
                case 0:
                serial([
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); }
                ], done);
                break;
                case 1:
                serial([
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); }
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