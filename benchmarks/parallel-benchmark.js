/* global module require */

var parallel = require('../lib/parallel');

module.exports = {
    'Parallel processes': function(done) {
        var test = function (done) {
            switch (Math.round(Math.random())) {
                case 0:
                parallel([
                    function(done) { var test = Math.random() * 100000; done(); },
                    function(done) { var test = Math.random() * 200000; done(); },
                    function(done) { var test = Math.random() * 300000; done(); },
                    function(done) { var test = Math.random() * 400000; done(); },
                    function(done) { var test = Math.random() * 500000; done(); },
                    function(done) { var test = Math.random() * 600000; done(); },
                    function(done) { var test = Math.random() * 700000; done(); },
                    function(done) { var test = Math.random() * 800000; done(); },
                    function(done) { var test = Math.random() * 900000; done(); },
                    function(done) { var test = Math.random() * 1000000; done(); }
                ], done);
                break;
                case 1:
                parallel([
                    function(done) { var test = Math.random() * 1000000; done(); },
                    function(done) { var test = Math.random() * 900000; done(); },
                    function(done) { var test = Math.random() * 800000; done(); },
                    function(done) { var test = Math.random() * 700000; done(); },
                    function(done) { var test = Math.random() * 600000; done(); },
                    function(done) { var test = Math.random() * 500000; done(); },
                    function(done) { var test = Math.random() * 400000; done(); },
                    function(done) { var test = Math.random() * 300000; done(); },
                    function(done) { var test = Math.random() * 200000; done(); },
                    function(done) { var test = Math.random() * 100000; done(); }
                ], done);
                break;
            };
        };

        parallel([
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