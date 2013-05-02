/* global module require */
var worker = require('./map-worker');

/**
 * Execute a function on each element in a list in parallel and execute
 * an optional callback function when done.
 *
 * @method mapParallel
 * @static
 * @for Operandi
 * @param {Object} list An array of elements
 * @param {Function} fn function to execute on each element in the list
 * @param {Function} [cb] callback to execute when done
 */
function mapParallel (list, fn, cb) {
    var job;

    // if there is no functions to execute it will just call the callback
    if (! fn || fn.length === 0) {
        if (typeof cb === 'function') {
            cb();
        }
        return;
    }

    job = Object.create(worker);
    job.init(list, fn, cb, this);
}

module.exports = mapParallel;
