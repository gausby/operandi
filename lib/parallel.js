/* global module process require */
var worker = require('./worker');

/**
 * Executes a list of functions in parallel. When done it will call an
 * optional callback function.
 *
 * @method parallel
 * @static
 * @for Operandi
 * @param {Object} fns List of functions to execute
 * @param {Function} [cb] callback to execute when done
 * @return {Undefined}
 */
function parallel (fns, cb) {
    var job;

    // if there is no functions to execute it will just call the callback
    if (! fns || fns.length === 0) {
        if (typeof cb === 'function') {
            cb.call(this);
        }
        return;
    }

    job = Object.create(worker);
    job.init(fns, cb, this);
}

module.exports = parallel;
