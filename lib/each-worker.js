/* global module process setImmediate */

/**
 * An empty function that does nothing, that will get used instead of
 * creating numerous empty anonymous functions, in situations where
 * an operation has no callback function.
 *
 * @method noop
 * @return {Undefined} nothing
 */
function noop () {}

/**
 * A process scheduler that apply a function to a list of elements.
 *
 * @class eachWorker
 */
module.exports = {
    /**
     * Start tasks in the operation. Throttle the number of simultaneously
     * running tasks so they do not exceed the given limit, and call the
     * callback function when everything has been processed.
     *
     * @method scheduler
     * @return {Undefined}
     */
    scheduler: function () {
        var self = this;

        function reportBack(){
            setImmediate(function() {
                self.running -= 1;
                self.scheduler.call(self);
            });
        }

        // start processes
        for (;(this.running < this.simultanious) && (this.steps > this.cursor); this.cursor += 1) {
            this.running += 1;
            this.fn.apply(this.scope, [this.list, this.cursor, reportBack]);
        }

        if (this.running === 0) {
            this.done();
        }
    },

    /**
     * Run the callback and clean up
     *
     * @method done
     * @return {Undefined}
     */
    done: function () {
        var prop;
        this.cb();

        for (prop in this) {
            delete this[prop];
        }
    },

    /**
     * Initialize and start the scheduler
     *
     * @method init
     * @param {Object} list An array of elements
     * @param {Function} fn The function to apply to every list element
     * @param {Function} [cb=noop] Optional callback
     * @param {Object} [scope={}] Context to run the functions in
     * @return {Undefined}
     */
    init: function (list, fn, cb, scope) {
        this.list = list;
        this.fn = fn;
        this.steps = list.length;
        this.cursor = 0;
        this.running = 0;

        this.simultanious = this.simultanious || this.steps;

        this.cb = cb || noop;
        this.scope = scope || {};

        this.scheduler();
    }
};
