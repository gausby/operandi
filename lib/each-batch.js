/* global module require */
var worker = require('./each-worker');

/**
 * Execute a function on each element in a list in batches of a given
 * size and execute an optional callback function when done.
 *
 * @method eachBatch
 * @static
 * @for Operandi
 * @param {Object} list List of elements
 * @param {Function} fn Function to run on each element in the list
 * @param {Number} simultanious Number of functions to execute at a time
 * @param {Function} [cb] Callback to execute when done
 */
function eachBatch (list, fn, simultanious, cb) {
    var job;

    // if there is no functions to execute it will just call the callback
    if (! fn || fn.length === 0) {
        if (typeof cb === 'function') {
            cb();
        }
        return;
    }

    job = Object.create(worker);
    job.simultanious = simultanious;
    job.init(list, fn, cb, this);
}

module.exports = eachBatch;