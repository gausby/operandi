/* global module process require */
var worker = require('./worker');

/**
 * Execute a list of functions in batches of a given size. Then it will
 * execute an optional callback function.
 *
 * @method batch
 * @static
 * @for Operandi
 * @param {Object} fns List of functions to execute
 * @param {Number} simultanious Number of functions to execute at a time
 * @param {Function} [cb] Callback to execute when done
 */
function batch (fns, simultanious, cb) {
    var job;

    // if there is no functions to execute it will just call the callback
    if (! fns || fns.length === 0) {
        if (typeof cb === 'function') {
            cb();
        }
        return;
    }

    job = Object.create(worker);
    job.simultanious = simultanious;
    job.init(fns, cb, this);
}

module.exports = batch;
