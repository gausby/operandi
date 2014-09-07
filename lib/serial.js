/* global module require */
var worker = require('./worker');

/**
 * Executes a list of functions in series. One at a time.
 * When done it will call an optional callback function.
 *
 * @method serial
 * @static
 * @for Operandi
 * @param {Object} fns List of functions to execute
 * @param {Function} [cb] callback to execute when done
 * @return {Undefined}
 */
function serial (fns, cb) {
    var job;

    if (! fns || fns.length === 0) {
        if (typeof cb === 'function') {
            cb.call(this);
        }
        return;
    }

    job = Object.create(worker);
    job.simultaneous = 1;
    job.init(fns, cb, this);
}

module.exports = serial;
