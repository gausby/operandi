/* global require module */
var batch = require('./batch'),
    parallel = require('./parallel'),
    serial = require('./serial'),
    eachParallel = require('./each-parallel'),
    eachSerial = require('./each-serial'),
    eachBatch = require('./each-batch')
;

/**
 * Modus Operandi. A library for [Node](http://nodejs.org/) that ensure
 * execution of a set of functions before calling an optional callback
 * function.
 *
 * @module Operandi
 */

module.exports.parallel = parallel;
module.exports.serial = serial;
module.exports.batch = batch;

module.exports.eachParallel = eachParallel;
module.exports.eachSerial = eachSerial;
module.exports.eachBatch = eachBatch;
