/* global module require */
var worker = require('./each-worker');

/**
 * Execute a function on each element in a list and execute an optional
 * callback function when done.
 *
 * @method eachSerial
 * @static
 * @for Operandi
 * @param {Object} list List of elements
 * @param {Function} fn Function to execute on each element in the list
 * @param {Function} [cb] Callback to execute when done
 */
function eachSerial (list, fn, cb) {
    var job;

    // if there is no functions to execute it will just call the callback
    if (! fn || fn.length === 0) {
        if (typeof cb === 'function') {
            cb();
        }
        return;
    }

    job = Object.create(worker);
    job.simultanious = 1;
    job.init(list, fn, cb, this);
}

module.exports = eachSerial;