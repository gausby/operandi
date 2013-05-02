/* global require module */
var batch = require('./batch'),
    parallel = require('./parallel'),
    serial = require('./serial'),
    mapParallel = require('./map-parallel'),
    mapSerial = require('./map-serial'),
    mapBatch = require('./map-batch')
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

module.exports.mapParallel = mapParallel;
module.exports.mapSerial = mapSerial;
module.exports.mapBatch = mapBatch;
