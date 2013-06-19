/* global module require */
var worker = require('./each-worker');

/**
 * Execute a function on each element in a list in parallel and execute
 * an optional callback function when done.
 *
 * @method eachParallel
 * @static
 * @for Operandi
 * @param {Object} list An array of elements
 * @param {Function} fn function to execute on each element in the list
 * @param {Function} [cb] callback to execute when done
 */
function eachParallel (list, fn, cb) {
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
    job.init(list, fn, cb, this);
}

module.exports = eachParallel;
