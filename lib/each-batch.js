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
function eachBatch (list, fn, simultaneous, cb) {
    var job;

    var isArray = Object.prototype.toString.call(list) === '[object Array]';

    // if there is no items to execute fn on it will just call the callback
    if (! list || isArray && list.length === 0) {
        if (typeof cb === 'function') {
            cb.call(this);
        }
        return;
    }

    job = Object.create(worker);
    job.simultaneous = simultaneous;
    job.init(list, fn, cb, this);
}

module.exports = eachBatch;
